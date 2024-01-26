export const handleScroll = (page, setPage, scrolled) => {
    const handleScrollEvent = () => {
        if (
            document.getElementById("articles") !== null &&
            window.scrollY + window.innerHeight > document.getElementById("articles").offsetHeight
        ) {
            console.log("scrolled")
            setPage(page + 1)
            window.removeEventListener("scroll", handleScrollEvent)
        }
    }

    window.addEventListener("scroll", handleScrollEvent)
    if (scrolled === true) {
        window.removeEventListener("scroll", handleScrollEvent)
    }
}
