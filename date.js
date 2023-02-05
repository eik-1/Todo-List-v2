exports.getDate = function () {
    const today = new Date(); /* Date() creates an object 'today' that has many methods 
                                that allows us to operate on dates */
    var options = {
        weekday: "long",
        day: "numeric",
        month: "long"
    }
    var day = today.toLocaleDateString("en-US", options);
    return day;
}