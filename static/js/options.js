class Options {
    constructor(div_id, options) {
        this.div_id = div_id
        this.div = document.getElementById(this.div_id)
        this.options = options
        this.selected = options
        var select = this.make_select(this.options)
        this.div.appendChild(select)
    }

    make_select(options){
        var select = document.createElement("select")
        select.className = "selectpicker filter-select"
        var multiple = document.createAttribute("multiple")
        select.setAttributeNode(multiple)
        select.setAttribute("data-actions-box", "true");
        select.setAttribute("data-selected-text-format", "count > 1")

        options.forEach(function(d) {
            var option = document.createElement("option")
            option.innerHTML = d
            option.selected = true
            select.appendChild(option)
        })

        select.onchange = function(){
            this.selected = $(select).val()
        }.bind(this)
        return select
    }
}