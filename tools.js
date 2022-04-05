String.prototype.replaceAt = function(index, payload){
    return this.substring(0, index) + payload + this.substring(index + payload.length)
}