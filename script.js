const micButton = document.getElementById('mic-button');
const statusText = document.getElementById('status');
const resultDiv = document.getElementById('result');
const foodContentDiv = document.getElementById('food-content'); // Hiển thị cho ăn uống
const transportContentDiv = document.getElementById('transport-content'); // Hiển thị cho đi lại
const totalFoodExpenseDiv = document.getElementById('total-food-expense'); // Phần hiển thị tổng tiền ăn uống
const totalTransportExpenseDiv = document.getElementById('total-transport-expense'); // Phần hiển thị tổng tiền đi lại

let isMicOn = false;
let recognition;
let totalFoodExpense = 0; // Biến để lưu tổng tiền ăn uống
let totalTransportExpense = 0; // Biến để lưu tổng tiền đi lại

if ('webkitSpeechRecognition' in window) {
    recognition = new webkitSpeechRecognition();
    recognition.lang = 'vi-VN';
    recognition.continuous = true;
    recognition.interimResults = true;

    recognition.onstart = function () {
        isMicOn = true;
        micButton.textContent = 'Tắt micro'; // Đổi chữ trên nút khi bật mic
        micButton.classList.add('active');
        statusText.textContent = 'Trạng thái: Bật';
    };

    recognition.onresult = function (event) {
        const transcript = Array.from(event.results)
            .map(result => result[0])
            .map(result => result.transcript)
            .join('');
        resultDiv.textContent = transcript; // Hiển thị nội dung hiện tại
    };

    recognition.onend = function () {
        isMicOn = false;
        micButton.textContent = 'Bật micro'; // Đổi chữ trên nút khi tắt mic
        micButton.classList.remove('active');
        statusText.textContent = 'Trạng thái: Tắt';
    };

    micButton.addEventListener('click', () => {
        if (isMicOn) {
            recognition.stop();
        } else {
            recognition.start();
        }
    });
} else {
    alert('Trình duyệt không hỗ trợ');
}

// Sự kiện nhấn nút "Xóa nội dung để nói lại"
document.getElementById("reset-button").addEventListener("click", function () {
    resultDiv.textContent = "nd: ";
});

// Sự kiện nhấn nút "OK" để lưu nội dung vào đúng khu vực
document.getElementById("save-button").addEventListener("click", function () {
    let currentResult = resultDiv.textContent;

    // Kiểm tra xem có nội dung nào để lưu không
    if (currentResult !== "nd: " && currentResult !== "") {
        // Tạo một dòng mới cho nội dung đã lưu
        let newContent = document.createElement('div');

        // Phân loại nội dung dựa trên từ khóa và thêm vào khu vực tương ứng
        if (currentResult.includes('ăn uống')) {
            newContent.textContent = currentResult; // Thêm nội dung mới
            foodContentDiv.appendChild(newContent); // Thêm vào phần nội dung ăn uống

            // Tìm và cộng các số trong câu nói
            totalFoodExpense += sumNumbersInText(currentResult);
            totalFoodExpenseDiv.textContent = "Tổng tiền ăn uống: " + totalFoodExpense + " VND"; // Cập nhật tổng tiền
        } else if (currentResult.includes('đi lại')) {
            newContent.textContent = currentResult; // Thêm nội dung mới
            transportContentDiv.appendChild(newContent); // Thêm vào phần nội dung đi lại

            // Tìm và cộng các số trong câu nói
            totalTransportExpense += sumNumbersInText(currentResult);
            totalTransportExpenseDiv.textContent = "Tổng tiền đi lại: " + totalTransportExpense + " VND"; // Cập nhật tổng tiền
        } else {
            alert("Nội dung không liên quan đến 'ăn uống' hoặc 'đi lại'");
        }

        // Xóa nội dung hiện tại sau khi lưu
        resultDiv.textContent = "nd: ";
    } else {
        alert("Không có nội dung nào để lưu");
    }
});

// Hàm để tìm và cộng các số trong văn bản
function sumNumbersInText(text) {
    // Chuyển dấu phẩy thành dấu chấm và loại bỏ dấu cách
    const normalizedText = text.replace(/,/g, '').replace(/\./g, '.'); 
    const numbers = normalizedText.match(/\d{1,3}(?:\.\d{3})*(?:,\d+)?/g); // Tìm tất cả các số trong văn bản
    if (numbers) {
        return numbers.reduce((sum, num) => {
            // Chuyển đổi số từ chuỗi thành số thực
            return sum + parseFloat(num.replace(/\./g, '').replace(/,/g, '.')); // Xử lý các định dạng số
        }, 0); // Cộng tất cả các số lại
    }
    return 0; // Nếu không tìm thấy số nào, trả về 0
}
