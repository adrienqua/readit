export const formatDate = (format) => {
    var options = { year: "numeric", month: "long", day: "numeric" }
    return format.toLocaleString().slice(0, 19).replace("T", " à ")
}
