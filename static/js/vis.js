class Vis {
    constructor(models, features, feature_types, max_small_multiples) {
        this.models = new Options("models", models)
        this.features = new Options("features", features)
        this.feature_types = feature_types
        this.max_small_multiples = max_small_multiples
        $("#run-button").click(function(){this.run()}.bind(this))

        this.content_width = document.getElementById("content").offsetWidth
        this.content_height = $('#footer').offset().top - $('#header').height()
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

    plot_predicates(predicates){
        var width = (this.content_width-8) / this.max_small_multiples
        var height = width * .75
        var plots = document.getElementById("small-multiples")

        for (var predicate_num in predicates){
            var predicate_group = document.createElement('div')
            predicate_group.id = "predicate-group-" + predicate_num
            predicate_group.className = "predicate-group row border"
            predicate_group.style.display = 'none'
            var predicate_plots = predicates[predicate_num]
            predicate_plots.forEach(function(predicate_plot){
                var feature_type = feature_types[predicate_plot.x]
                if (feature_type == 'continuous'){
                    var plot = new ContinuousSM(width, height, predicate_plot.data, predicate_plot.x, predicate_plot.y, this)
                } else if (feature_type == 'discrete'){
                    var plot = new ContinuousSM(width, height, predicate_plot.data, predicate_plot.x, predicate_plot.y, this)
                }
                predicate_group.appendChild(plot.plot_container)
            }.bind(this))
            plots.appendChild(predicate_group)
        }
    }

    make_predicates(predicates){
        var options = Object.keys(predicates)
        var predicate_select = new PredicateSelect("predicates", options, this)
    }

    run(){
        var models = this.models.selected
        var features = this.features.selected
        var specificity = $("#slider-range").val()

        this.get_predicates(models, features, specificity).then(function(predicates){
            this.plot_predicates(predicates)
            this.make_predicates(predicates)
        }.bind(this))
    }
}