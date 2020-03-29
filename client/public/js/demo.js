const moreText = () => {
    window.onload = () => {
        const txtContents = document.getElementById('contents')
        txtContents.addEventListener("click", (e) => {
            // let lines = txtContents.style.webkitLineClamp;
            console.log("Lines\t" + lines);
            if (lines == 3) {
                txtContents.style.webkitLineClamp = null;
            } else {
                txtContents.style.webkitLineClamp = 3;
            }
            console.log(txtContents.style)
        })

    }
}

// 접기 OR 펼치기 함수 실행
// moreText();