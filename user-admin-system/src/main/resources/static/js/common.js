function request(url, method, data, success) {
    $.ajax({
        url: url,
        method: method,
        contentType: "application/json",
        data: data ? JSON.stringify(data) : null,
        success: function (res) {
            success(res);
        },
        error: function () {
            alert("网络错误，请重试");
        }
    });
}