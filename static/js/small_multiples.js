class SmallMultiple {
    constructor(width, height, data, x_field, y_field, vis){
        this.width = width
        this.height = height
        this.data = data
        this.x_field = x_field
        this.y_field = y_field
        this.vis = vis
        this.filtered = false

        this.parseTime = d3.timeParse("%Y-%m-%d")
        this.formatTime = d3.timeFormat("%Y-%m-%d")

        this.plot_margin = 10
        this.svg_margin = {top: 50, right: 50, bottom: 50, left: 50}
        this.svg_width = width - this.plot_margin - this.svg_margin.left - this.svg_margin.right
        this.svg_height = height - this.plot_margin - this.svg_margin.top - this.svg_margin.bottom
        var plot_plot_container = this.make_plot(this.x_field)
        this.plot = plot_plot_container[0]
        this.plot_container = plot_plot_container[1]
        this.svg = this.make_svg(this.plot)

    }

    make_plot(feature){
        var plot_container = document.createElement('div')
        plot_container.id = feature + "-plot"
        plot_container.className = "plot-container"

        var plot = document.createElement('div')
        plot.className = "card-header border btn"
        plot.style.height = this.height + "px"
        plot.style.width = this.width + "px"
        plot.onclick = function () {
            if (!this.filtered){
                $(".plot-container").removeClass("selected-plot")
                $(this.plot_container).addClass("selected-plot")
            }
        }.bind(this)
        plot_container.appendChild(plot)
        return [plot, plot_container]
    }

    make_svg(plot){
        var svg = d3.select(plot).append("svg")
            .attr("width", this.svg_width + this.svg_margin.left + this.svg_margin.right)
            .attr("height", this.svg_height + this.svg_margin.top + this.svg_margin.bottom)
          .append("g")
            .attr("transform", "translate(" + this.svg_margin.left + "," + this.svg_margin.top + ")");
        return svg
    }

    make_x_axis(svg, x){
        var x_axis = svg.append("g")
          .attr("transform", "translate(0," + this.svg_height + ")")
          .call(d3.axisBottom(x))
          .selectAll("text")
          .style("text-anchor", "end")
          .attr("dx", "-.8em")
          .attr("dy", ".15em")
          .attr("transform", "rotate(-65)");
        return x_axis
    }

    make_y_axis(svg, y){
        var y_axis = svg.append("g")
          .call(d3.axisLeft(y));
        return y_axis
    }
}

class ContinuousSM extends SmallMultiple {
    constructor(width, height, data, x_field, y_field, vis) {
        super(width, height, data, x_field, y_field, vis)
        var xy = this.get_scale(this.data, this.x_field, this.y_field)
        this.x = xy[0]
        this.y = xy[1]
        this.x_axis = this.make_x_axis(this.svg, this.x)
        this.y_axis = this.make_y_axis(this.svg, this.y)
        this.make_scatter(this.svg, this.data, this.x_field, this.y_field)
    }

    get_scale(data, x_field, y_field){
        var x = d3.scaleLinear()
                .range([0, this.svg_width])
                .domain(d3.extent(data, function(d) {return d[x_field]}))
        var y = d3.scaleLinear()
                .range([this.svg_height, 0])
                .domain(d3.extent(data, function(d) {return d[y_field]}))
        return [x, y]
    }

    make_scatter(svg, data, x_field, y_field){
        var color = d3.scaleLinear().domain([0, 1])
                        .range(["#5dade2", "#ec7063"])
        svg.selectAll(".dot")
          .data(data)
        .enter().append("circle")
          .attr("class", "dot")
          .attr("r", 3.5)
          .attr("cx", function(d) { return this.x(d[x_field]); }.bind(this))
          .attr("cy", function(d) { return this.y(d[y_field]); }.bind(this))
          .style("fill", function(d) { console.log(d.anomaly); return color(d.anomaly); })
          .style("opacity", .7)
    }

}