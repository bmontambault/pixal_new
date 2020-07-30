class Options {
    constructor(div_id, group, options, vis) {
        this.div_id = div_id
        this.group = group
        this.div = document.getElementById(this.div_id)
        this.options = options
        this.vis = vis
        this.selected = []
        this.make_options(this.div_id, this.div, this.group, this.options)
    }

    toggle_selected(group, option){
        var selected_class = "selected-" + group
        if ($("#" + option).hasClass(selected_class)){
            $("#" + option).removeClass(selected_class)
            this.selected.splice(this.selected.indexOf(option), 1)
        } else {
            $("#" + option).addClass(selected_class)
            this.selected.push(option)
        }
    }

    make_options(div_id, div, group, options){
        options.forEach(function(option){
            var card = this.make_card(div_id, group, option)
            div.appendChild(card)
        }.bind(this))
    }

    make_card(div_id, group, option){
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
        select_button.onclick = function (d) { this.toggle_selected(group, option) }.bind(this)

        card.appendChild(button_group)
        button_group.appendChild(select_button)
        card_header.className = div_id
        return card
    }

}