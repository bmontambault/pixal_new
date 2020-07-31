class Vis {
    constructor(models, features, feature_types, projection, max_small_multiples) {
        this.models = new Options("models", models)
        this.features = new Options("features", features)
        this.feature_types = feature_types
        this.projection = projection
        this.max_small_multiples = max_small_multiples
        $("#run-button").click(function(){this.run()}.bind(this))

        this.content_width = document.getElementById("content").offsetWidth
        this.content_height = $('#footer').offset().top - $('#header').height()
        this.sm_width = (this.content_width-8) / this.max_small_multiples
        this.sm_height = this.sm_width * .75
        this.proj_height = this.content_height - this.sm_height

        this.projection = new Projection("projection", this.content_width, this.proj_height, projection)
    }

    get_predicates(models, features, specificity){
        var data = {'models': models, 'features': features, 'specificity': specificity}
        return $.ajax({
            url: '/get_predicates',
            type: "POST",
            dataType: "JSON",
            data: JSON.stringify(data),
            success: function(resp, data){
                if (resp != null){
                    return resp
                }
            }.bind(this)
        });
    }

    plot_predicates(predicate_data){
        var plots = document.getElementById("small-multiples")

        for (var predicate_num in predicate_data){
            var predicate_group = document.createElement('div')
            predicate_group.id = "predicate-group-" + predicate_num
            predicate_group.className = "predicate-group row border"
            predicate_group.style.display = 'none'
            var predicate_plots = predicate_data[predicate_num]
            predicate_plots.forEach(function(predicate_plot){
                var feature_type = feature_types[predicate_plot.x]
                if (feature_type == 'continuous'){
                    var plot = new ContinuousSM(this.sm_width, this.sm_height, predicate_plot.data, predicate_plot.x, predicate_plot.y, this)
                } else if (feature_type == 'discrete'){
                    var plot = new ContinuousSM(this.sm_width, this.sm_height, predicate_plot.data, predicate_plot.x, predicate_plot.y, this)
                } else if (feature_type == 'date'){
                    var plot = new DateSM(this.sm_width, this.sm_height, predicate_plot.data, predicate_plot.x, predicate_plot.y, this)
                }
                predicate_group.appendChild(plot.plot_container)
            }.bind(this))
            plots.appendChild(predicate_group)
        }
    }

    make_predicates(predicate_index, predicate_features){
        var options = Object.keys(predicate_index)
        var predicate_select = new PredicateSelect("predicates", options, predicate_index, predicate_features, this)
    }

    run(){
        var models = this.models.selected
        var features = this.features.selected
        var specificity = $("#slider-range").val()

        this.get_predicates(models, features, specificity).then(function(predicates){
            var predicate_data = predicates['predicate_data']
            var predicate_index = predicates['predicate_index']
            var predicate_features = predicates['predicate_features']
            this.plot_predicates(predicate_data)
            this.make_predicates(predicate_index, predicate_features)
        }.bind(this))
    }
}