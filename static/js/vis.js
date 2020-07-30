class Vis {
    constructor(models, features, feature_types, max_small_multiples) {
        this.models = new Options("models", "model", models, this)
        this.features = new Options("features", "feature", features, this)
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

    run(){
        var models = this.models.selected
        var features = this.features.selected
        var specificity = $("#slider-range"). val()

        var width = (this.content_width-8) / this.max_small_multiples
        var height = width * .75
        var plots = document.getElementById("small-multiples")

        this.get_predicates(models, features, specificity).then(function(predicates){
            predicates.forEach(function(predicate){
                var feature_type = feature_types[predicate.x]
                if (feature_type == 'continuous'){
                    var plot = new ContinuousSM(width, height, predicate.data, predicate.x, predicate.y, this)
                } else if (feature_type == 'discrete'){
                    var plot = new ContinuousSM(width, height, predicate.data, predicate.x, predicate.y, this)
                }
                plots.appendChild(plot.plot_container)
            }.bind(this))
        }.bind(this))
    }

//    plot_predicate(predicate, y_field, max_small_multiples){
//        var width = (this.content_width-8) / max_small_multiples
//        var height = this.plot_width * .75
//        var plots = document.getElementById("#small-multiples")
//
//        var filtered_data = null
//        for (var x_field in predicate){
//            for (var filter in predicate){
//                if (filter != feature){
//                    if (filtered_data != null){
//                        filtered_data = this.data.filter(d => predicate[filter].contains(d[filter]));
//                    } else {
//                        filtered_data = filtered_data.filter(d => predicate[filter].contains(d[filter]));
//                    }
//                }
//            }
//            var plot = new ContinuousSM(width, height, filtered_data, x_field, y_field, this)
//            plots.appendChild(plot)
//        }
//    }

}