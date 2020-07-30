class ContinuousPredicate {
    constructor(min_value, max_value){
        this.min_value = min_value
        this.max_value = max_value
    }

    contains(value){
        return value >= this.min_value && value <= this.max_value
    }
}

class DiscretePredicate {
    constructor(values){
        this.values = values
    }

    contains(value){
        return this.values.includes(value)
    }
}