class PredicateSelect {
    constructor(div_id, options, options_index, vis) {
        this.div_id = div_id
        this.div = document.getElementById(this.div_id)
        this.options = options
        this.options_index = options_index
        this.vis = vis
        this.selected = null
        this.make_options(this.div_id, this.div, this.options)
    }

    toggle_selected(option){
        var selected_class = "selected-predicate"
        if ($("#" + option).hasClass(selected_class)){
            $("#" + option).removeClass(selected_class)
            this.selected = null
        } else {
            $("." + selected_class).removeClass(selected_class)
            $("#" + option).addClass(selected_class)
            this.selected = option
        }
        if (this.selected != null){
            var index = this.options_index[this.selected]
            console.log(index)
            $(".predicate-group").hide()
            $("#predicate-group-" + this.selected).show()
            $(".projection-point").removeClass("selected-point")
            for (var i in index){
                $("#point-" + index[i]).addClass("selected-point")
            }

        }
    }

    make_options(div_id, div, options){
        options.forEach(function(option){
            var card = this.make_card(div_id, option)
            div.appendChild(card)
        }.bind(this))
    }

    make_card(div_id, option){
        var card = document.createElement('div')
        card.className = 'card'
        var card_header = document.createElement('div')
        card_header.id = option + "-header"
        card_header.className = "card-header"
        card.appendChild(card_header)

        var button_group = document.createElement('div')
        button_group.id = option + "-group"
        button_group.className = "btn-group"

        var select_button = document.createElement('button')
        select_button.id = option
        select_button.innerHTML = option
        select_button.style.textAlign = "left"
        select_button.className = "btn btn-block feature-button " + this.div_id
        select_button.className += " border-right"
        select_button.onclick = function (d) { this.toggle_selected(option) }.bind(this)

        card.appendChild(button_group)
        button_group.appendChild(select_button)
        card_header.className = div_id
        return card
    }

}