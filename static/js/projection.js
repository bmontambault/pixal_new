class Projection {
    constructor(div_id, width, height, data) {
        this.div_id = div_id
        this.width = width
        this.height = height
        this.data = data

        this.plot_margin = 10
        this.svg_margin = {top: 50, right: 50, bottom: 50, left: 50}
        this.svg_width = width - this.plot_margin - this.svg_margin.left - this.svg_margin.right
        this.svg_height = height - this.plot_margin - this.svg_margin.top - this.svg_margin.bottom

        this.div = document.getElementById(this.div_id)
        this.plot = this.make_plot()
        this.div.appendChild(this.plot)
        this.svg = this.make_svg(this.plot)
        this.x = d3.scaleLinear()
                .range([0, this.svg_width])
                .domain(d3.extent(data, function(d) {return d.x}))
        this.y = d3.scaleLinear()
                .range([this.svg_height, 0])
                .domain(d3.extent(data, function(d) {return d.y}))
        this.x_axis = this.svg.append("g")
                .attr("transform", "translate(0," + this.svg_height + ")")
                .call(d3.axisBottom(this.x))
        this.y_axis = this.svg.append("g")
                .call(d3.axisLeft(this.y));
        this.make_scatter(this.svg, this.data)

    }

    make_y_axis(svg, y){
        var y_axis = svg.append("g")
          .call(d3.axisLeft(y));
        return y_axis
    }

    make_plot(feature){
        var plot = document.createElement('div')
        plot.style.height = this.height + "px"
        plot.style.width = this.width + "px"
        return plot
    }

    make_svg(plot){
        var svg = d3.select(plot).append("svg")
            .attr("width", this.svg_width + this.svg_margin.left + this.svg_margin.right)
            .attr("height", this.svg_height + this.svg_margin.top + this.svg_margin.bottom)
          .append("g")
            .attr("transform", "translate(" + this.svg_margin.left + "," + this.svg_margin.top + ")");
        return svg
    }

    make_scatter(svg, data){
        svg.selectAll(".dot")
          .data(data)
        .enter().append("circle")
          .attr("id", function(d) { return "point-"+d.index }.bind(this))
          .attr("class", "dot")
          .attr("class", "projection-point")
          .attr("fill", "gray")
          .attr("r", 3.5)
          .attr("cx", function(d) { return this.x(d.x); }.bind(this))
          .attr("cy", function(d) { return this.y(d.y); }.bind(this))
          .style("opacity", .7)
    }
}