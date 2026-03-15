document.addEventListener("DOMContentLoaded", function () {
    let selects = document.querySelectorAll("select");
    selects.forEach(select => {
        if (select.options.length > 3) {
            select.classList.add('scrollable');
        select.size=3}
    })
})


