window.addEventListener('load', function () {
    const canvas = document.getElementById('canvas1')
    const ctx = canvas.getContext('2d');
    canvas.width = 800;
    canvas.height = 720;
    let nhomkedich = [];

    class Nhapnutbanphim {
        constructor() {
            this.keys = []   //array key,mảng này dùng để chứa các phím đã được nhấn.
            window.addEventListener('keydown', e => {
                if ((e.key === 'ArrowDown' ||
                        e.key === 'ArrowUp' ||
                        e.key === 'ArrowLeft' ||
                        e.key === 'ArrowRight')
                    && this.keys.indexOf(e.key) === -1) {
                    // indexof để tránh lỗi trùng lặp, nếu chưa có nút keydown ở trong mảng thì mới đẩy vào, còn nếu có nút đấy rồi thì thôi.
                    this.keys.push(e.key);
                }
                //mỗi khi sự kiện keydown xảy ra, thì hàm callback sẽ được gọi và thêm phím đó vào array tên là keys.
                console.log(e.key, this.keys)
            });
            //keyup là nhả nút ra, còn keydown là ấn nút xuống, sự kiện này dùng để xoá nút vừa bấm để không bị quá tải dung lượng.
            window.addEventListener('keyup', e => {
                if (e.key === 'ArrowDown' ||
                    e.key === 'ArrowUp' ||
                    e.key === 'ArrowLeft' ||
                    e.key === 'ArrowRight') {
                    this.keys.splice(this.keys.indexOf(e.key), 1);
                }
                console.log(e.key, this.keys);
            })
        }
    }

    class nhanvatchinh {
        constructor(gameWidth, gameHeight) {
            this.gameWidth = gameWidth;     //gameWidth và gameHeight là không gian của trò chơi hoạt động
            this.gameHeight = gameHeight;
            this.width = 128;
            this.height = 128;
            this.x = 0;
            this.y = 280  //lấy khung hoạt động trừ khi chiều cao kích thước của nhân vật ta sẽ biết được vị trí hiện tại của đối tượng
            this.hinhanh = document.getElementById('nhanvatchinh');
            this.frameY = 0
            this.frameX = 0;
            this.frameY = 3;
            this.speed = 0;
            this.buocnhayy = 0
            this.weight = 1
        }

        draw(noidung) { //draw dùng để vẽ và quản lý nội dung trên canvas, context là người dùng gọi,nằm trong class người chơi để vẽ canvas cho người chơi.
            // noidung.fillRect(this.x, this.y, this.width, this.height)  //fillrext dùng để vẽ hình chữ nhật
            // noidung.fillStyle = "white";
            noidung.drawImage(this.hinhanh, this.frameX * this.width, this.frameY * this.height,this.width, this.height, this.x, this.y, this.width, this.height)
        }
//this.x, this.y, this.width, this.height chỉ có tác dụng chính cho cả hình ảnh ấy, vậy nên phải thêm 4 chỉ số mới đằng trước để cắt nhỏ hình ảnh sx,sy,sw, sh
        update(nhapnut) {
            // if (this.frameX >= this.maxFrame) this.frameX = 0;
            // else this.frameX++;
            if (nhapnut.keys.indexOf('ArrowRight') > -1) {
                this.speed = 5 }
            else if(nhapnut.keys.indexOf('ArrowLeft') > -1) {
                this.speed = -5
            }
            else if (nhapnut.keys.indexOf('ArrowUp') > -1 && this.trenmatdat()) { //thoả mãn điều kiện ấn duy nhất một nút và nhân vật phải ở trên mặt đất)
                this.buocnhayy -= 45;
            }
            else {
                this.speed = 0;
            }
            this.x += this.speed;
            if (this.x < 0) this.x = 0; //nhân vật cham đến mép x là không chạy ra được nữa.
            else if (this.x > this.gameWidth - this.width) this.x = this.gameWidth - this.width
                //tức là nhân vật đang vượt quá mép phải của khung chơi.

            this.y += this.buocnhayy; // khiến cho y âm liên tục (nhân vật di chuyển lên trên)

            if (!this.trenmatdat()) {  //nếu nhân vật không còn trên mặt đất nữa (cũng tức là nhân vật nhảy lên không trung thì điều kiện này sẽ được x.)
                this.buocnhayy += this.weight;   //dù cho y có âm (tức là nhân vật di chuyển lên trên trong trường hợp này) bao nhiêu thì cũng dương di chuyển xuống dưới.
                this.frameY = 1
            } else { ////true, tức là nhân vật đã chạm vào mặt đất thì sẽ xử lý else này.
                this.buocnhayy = 20;  //nói dễ hiểu thì đây là lực hút trái đất, để số càng cao thì hút càng mạnh.
                this.frameY = 0
            }
            if(this.y > this.gameHeight - this.height) this.y = this.gameHeight - this.height
        }
        trenmatdat() { //hàm này để xác định xem lực hút trái đất có tồn tại không.
            return this.y >= this.gameHeight - this.height;  //để trả lại true false xác định rõ ràng nhân vật đang đứng trên mặt đấy ở mép trái bên dưới cùng.
        }

    }

    class background {
        constructor(gameWidth, gameHeight) {
            this.gameWidth = gameWidth;
            this.gameHeight = gameHeight;
            this.hinhanh = document.getElementById("background");
            this.x = 0;
            this.y = 0;
            this.width = 2000;
            this.height = 725;
            this.speed = 4;

        }
        draw(noidung) {
            noidung.drawImage(this.hinhanh, this.x, this.y, this.width, this.height);
            noidung.drawImage(this.hinhanh, this.x + this.width, this.y, this.width, this.height);

        }
        update() {
            this.x -= this.speed;
            if (this.x < 0 - this.width) this.x = 0
       }}

    class kedich {
        constructor(gameWidth, gameHeight) {
            this.gameWidth = gameWidth;
            this.gameHeight = gameHeight;
            this.width = 128;
            this.height = 128;
            this.hinhanh = document.getElementById("kedich");
            this.x = this.gameWidth;
            this.y = this.gameHeight - this.height;
            this.frameX = 0;
            this.maxFrame = 5;
            this.fps = 20
            this.frameTimer = 0;
            this.frameInterval = 1000/this.fps;
            this.speed = 8;
        }
        draw(noidung) {
            noidung.drawImage(this.hinhanh, this.frameX * this.width, 0, this.width, this.height, this.x, this.y, this.width, this.height)
        }
        update(deltaTime) {
            if (this.frameTimer > this.frameInterval) {
                if (this.frameX >= this.maxFrame) this.frameX = 0;
                else this.frameX++;
                this.frameTimer = 0;
            } else {
                this.frameTimer += deltaTime;
            }
            this.x -= this.speed;
        }
    }

    function xulykedich(deltaTime) {
        if (enemyTimer > enemyInterval + randomEnemyInterval) {
            nhomkedich.push(new kedich(canvas.width, canvas.height));
            randomEnemyInterval = Math.random() * 1000 + 500
            enemyTimer = 0;
        } else {
            enemyTimer += deltaTime;
        }
        nhomkedich.forEach(kedich => {
            kedich.draw(ctx);
            kedich.update(deltaTime);
        })
    }


    const nhapnut = new Nhapnutbanphim();
    const nguoichoi = new nhanvatchinh(canvas.width, canvas.height);  //cao và rộng của canvas để gán vào biến khung hình ban đầu.
    const phongnen = new background(canvas.width, canvas.height);

    let lastTime = 0;
    let enemyTimer = 0;
    let enemyInterval = 1000;
    let randomEnemyInterval = Math.random() * 1000 + 500;
    function animate(timeStamp) {
        const deltaTime = timeStamp - lastTime;
        //delta là dấu thời gian từ vòng lặp này trừ đi dấu thời gian từ vòng lặp trước.
        lastTime = timeStamp;
        ctx.clearRect(0,0, canvas.width, canvas.height)
        phongnen.draw(ctx);  //đặt nền lên trước giông như xếp layer ấy
        phongnen.update();
        nguoichoi.draw(ctx);  //ctx này lấy ở dòng 3 để vẽ 2d với hình như noidung miêu tả.
        nguoichoi.update(nhapnut);
        xulykedich(deltaTime);
        requestAnimationFrame(animate)

    }

    animate();
});

