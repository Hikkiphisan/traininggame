window.addEventListener('load', function () {
    const canvas = document.getElementById('canvas1')
    const ctx = canvas.getContext('2d');
    canvas.width = 800;
    canvas.height = 720;
    let arraykedich = [];
    let bienscore = 0;
    let gameover = false;
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
            this.frameX = 0;
            this.maxFrame = 7;
            this.frameY = 3;

            //để chạy hoạt hoạ
            this.fps = 20;
            this.frameTimer = 0;
            this.frameInterval = 1000/this.fps

            //di chuyển nhân vật
            this.speed = 0;
            this.buocnhayy = 0
            this.weight = 1
        }

        draw(noidung) { //draw dùng để vẽ và quản lý nội dung trên canvas, context là người dùng gọi,nằm trong class người chơi để vẽ canvas cho người chơi.
            // noidung.strokeStyle = "white";
            // noidung.strokeRect(this.x,this.y,this.width,this.height)
            // noidung.beginPath();
            // noidung.arc(this.x + this.width/2.1,
            //             this.y +this.height/1.3,
            //          this.width/3,
            //     0,
            //     Math.PI * 3);
            // noidung.stroke();

            noidung.drawImage(this.hinhanh, this.frameX * this.width, this.frameY * this.height,this.width, this.height, this.x, this.y, this.width, this.height)
        }
        //this.x, this.y, this.width, this.height chỉ có tác dụng chính cho cả hình ảnh ấy, vậy nên phải thêm 4 chỉ số mới đằng trước để cắt nhỏ hình ảnh sx,sy,sw, sh
        update(nhapnut, khoangthoigian_kethu_tieptheo_xuathien, arraykedich) {
            //xảy ra va chạm giữa hai hình khối
            arraykedich.forEach(enemy => {  //duyệt các phần tử trong mảng kẻ địch, mà mỗi phần tử đã được tôi đặt tên là enemy trong biến này.
                const dx = enemy.x - this.x;
                const dy = enemy.y - this.y;
                const khoangcach_giua_nguoichoi_va_kethu = Math.sqrt(dx * dx + dy * dy);
                      //định lý PY ta go, nhét vào hai toạ độ x,y của kẻ thù và người chơi

                if (khoangcach_giua_nguoichoi_va_kethu < enemy.width/200 + this.width/6) {
                       gameover = true;
                }
            })



            // điều kiện để chạy hoạt hoạ
            if (this.frameTimer > this.frameInterval) {
                if (this.frameX >= this.maxFrame) this.frameX = 0;
                else this.frameX++;
                this.frameTimer = 0;
            } else {
                this.frameTimer += khoangthoigian_kethu_tieptheo_xuathien;
            }





            this.x += this.speed;   //đây chính là hàm quyết định speed dùng để làm gì



            // if (this.frameX >= this.maxFrame) this.frameX = 0;
            // else this.frameX++;
            if (nhapnut.keys.indexOf('ArrowRight') > -1) {
                this.speed = 5
            } else if(nhapnut.keys.indexOf('ArrowLeft') > -1) {
                this.speed = -5
            } else if (nhapnut.keys.indexOf('ArrowUp') > -1 && this.trenmatdat()) { //thoả mãn điều kiện ấn duy nhất một nút và nhân vật phải ở trên mặt đất)
                this.buocnhayy -= 45;
            } else {this.speed = 0;}

            this.y += this.buocnhayy; // khiến cho y âm liên tục (nhân vật di chuyển lên trên)

            if (this.x < 0) this.x = 0; //nhân vật cham đến mép x là không chạy ra được nữa.
            else if (this.x > this.gameWidth - this.width) this.x = this.gameWidth - this.width
                //tức là nhân vật đang vượt quá mép phải của khung chơi.



            if (!this.trenmatdat()) {  //nếu nhân vật không còn trên mặt đất nữa (cũng tức là nhân vật nhảy lên không trung thì điều kiện này sẽ được x.)
                this.buocnhayy += this.weight;   //dù cho y có âm (tức là nhân vật di chuyển lên trên trong trường hợp này) bao nhiêu thì cũng dương di chuyển xuống dưới.
                this.frameY = 2   //nhân vât sẽ chuyển động từ frame Y =0 sang frama Y =1
            } else { ////true, tức là nhân vật đã chạm vào mặt đất thì sẽ xử lý else này.
                // this.buocnhayy = 20 ;  //nói dễ hiểu thì đây là lực hút trái đất, để số càng cao thì hút càng mạnh.
                this.frameY = 0
            }

            if(this.y > this.gameHeight - this.height) this.y = this.gameHeight - this.height   //để nhân vât không chui xuống lòng đất.
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
            if (this.x < 0 - this.width) this.x = 0 //0 - this.width tức là mép bên phải của hình ảnh đầu tiên đã chạm kịch canvas mép bên trái rồi
       }}

    class class_enemy {
        constructor(gameWidth, gameHeight) {
            this.gameWidth = gameWidth;
            this.gameHeight = gameHeight;
            this.width = 128;
            this.height = 128;
            this.hinhanh = document.getElementById("kedich");
            this.x = this.gameWidth + 200;   //điểm xuất phát của kẻ thù, nếu để this.gameWidth - 100 tức là con quái sẽ xuất phát từ bên ngoài canvas với khoảng cách 100 so vói mép bên phải.
            this.y = this.gameHeight - this.height;
            this.frameX = 0;
            this.maxframe = 5
            this.fps = 20; // sô frame sẽ hiển thị trong một khoảng thời gian (chưa khai báo)
            this.bodemthoigianframe = 0;
            this.khoangthoigian_frame_tieptheo_xuathien = 100000/this.fps;
            this.speed = 2;

            this.loaibo_Kethu_vuotqua_khoi_array = false; //để tránh tràn bộ nhớ
        }

        draw(noidung) {
            // noidung.strokeStyle = "white";
            // noidung.strokeRect(this.x,this.y,this.width,this.height)
            // noidung.beginPath(); // nó bắt đầu một đường path mới hoặc đặt lại đường path hiện tại của ngữ cảnh vẽ, bất kỳ dòng vẽ hay hình dạng nào được thực hiện sau beginPath() sẽ bắt đầu từ một điểm mới, không ảnh hưởng đến những gì đã được vẽ trước đó.
            // noidung.arc(this.x + this.width/1.6,    //method sử dụng để vẽ một đoạn đường cong hoặc một hình tròn.
            //     this.y +this.height/1.3,
            //     this.width/3,
            //     0,
            //     Math.PI * 3);
            // noidung.stroke();

            noidung.drawImage(this.hinhanh, this.frameX * this.width, 0, this.width, this.height, this.x, this.y, this.width, this.height)
        }
        update(khoang_cach_time_giua_now_va_last) {
            if (this.bodemthoigianframe < this.khoangthoigian_frame_tieptheo_xuathien ) { //if lồng nhau, nếu bộ đếm thời gian đạt một gia trị nào đó thì sẽ tự đặt về 0
                if (this.frameX >= this.maxframe) this.frameX = 0;
                else this.frameX++;   //frame sẽ liên tục tăng 0 đến 5 khiến nhân vật hoat hoạ nếu đến giá trị 5 thì tự reset về 0
                this.bodemthoigianframe = 0;
            } else {this.bodemthoigianframe +=  khoang_cach_time_giua_now_va_last;}
            this.x -= this.speed;

            if (this.x < 0 - this.width) {
                this.loaibo_Kethu_vuotqua_khoi_array = true;
                bienscore++
            }
        }
    }


    function taothemnhieukedich(khoang_cach_time_giua_now_va_last) {
       if (bodemthoigiankethu > khoangthoigian_kethu_tieptheo_xuathien + ngaunhien_kethu_tieptheo_xuathien) {
           arraykedich.push(new class_enemy(canvas.width, canvas.height));
           ngaunhien_kethu_tieptheo_xuathien = Math.random() * 10000 + 500
           bodemthoigiankethu = 0  //reset bộ đếm về 0

           //nếu điệu kiện thoả mãn thì sẽ đẩy thêm kẻ thù vào mảng enemy khiến cho kẻ thù lặp lại, và bộ đếm thời gian về lại không.

       } else {
           bodemthoigiankethu += khoang_cach_time_giua_now_va_last
       }
        arraykedich.forEach(phantu_enemy => {
            phantu_enemy.draw(ctx);
            phantu_enemy.update(khoang_cach_time_giua_now_va_last);
        });
       arraykedich = arraykedich.filter(phantu_enemy => !phantu_enemy.loaibo_Kethu_vuotqua_khoi_array)
    //dùng để loại bỏ kẻ địch ra khỏi mảng.
    }


    function hienthi_DiemSo(context) {
       context.fillStyle = 'black';
       context.font = "40px Helvetica";
       context.fillText("Điểm Số: " + bienscore, 20, 50);

       if (gameover) {  //neugameover trả ra true thì chạy những thứ trong này.
           context.textAlign = "center";
           context.font = "50px Arial"
           context.fillStyle = 'green';
           context.fillText("Bạn chơi gà thật đấy!", canvas.width -400, 200);

       }
    }


    const nhapnut = new Nhapnutbanphim();
    const nguoichoi = new nhanvatchinh(canvas.width, canvas.height);  //cao và rộng của canvas để gán vào biến gameWidth và gameHeight.
    const phongnen = new background(canvas.width, canvas.height);


    let moc_thoi_gian_chay_obj_truoc_do = 0

    let bodemthoigiankethu = 0;   //bố đếm khoảng thời gian về 0 khi chạm mức đếm và quay về không
    let khoangthoigian_kethu_tieptheo_xuathien =  10   //thêm kẻ thù mới cứ sau 1000 ml giây, 1 giây bằng 1000ml giây
    let ngaunhien_kethu_tieptheo_xuathien = Math.random() * 1000 + 500 //mathramdom() đang chạy ngẫu nhiên từ 0 đến 1 trong ngoặc kép.
  //tức là chạy ngẫu nhiên từ 500 đến 1000
    // Khi nhân với 1000 (Math.random() * 1000), ta có được một số ngẫu nhiên từ 0 đến 1000 (bao gồm 0 nhưng không bao gồm 1000).

    function animate(dau_moc_thoi_gian_now) {   //tác dụng như vòng lặp, vứt cái gì vào đây là nó lặp lại theo quy trình, 60s mỗi frame
        const khoang_cach_time_giua_now_va_last = dau_moc_thoi_gian_now - moc_thoi_gian_chay_obj_truoc_do
        moc_thoi_gian_chay_obj_truoc_do = dau_moc_thoi_gian_now


// Nếu bodemthoigian là 1100ms, khoangthoigian_kethu_tieptheo_xuathien là 1000ms và ngaunhien_kethu_tieptheo_xuathien là 500ms, tổng thời gian cần thiết là 1500ms.. Khi bodemthoigian vượt quá 1500ms, điều kiện if sẽ thoả mãn và một kẻ thù mới sẽ được đẩy vào mảng arraykedich, đồng thời bodemthoigian sẽ được reset về 0 để bắt đầu đếm lại.

        ctx.clearRect(0,0, canvas.width, canvas.height)
        phongnen.draw(ctx);  //đặt nền lên trước giông như xếp layer ấy
        phongnen.update();
        nguoichoi.draw(ctx);  //ctx này lấy ở dòng 3 để vẽ 2d với hình như noidung miêu tả.
        nguoichoi.update(nhapnut, khoang_cach_time_giua_now_va_last, arraykedich);

        taothemnhieukedich(khoang_cach_time_giua_now_va_last);
        hienthi_DiemSo(ctx);
        if (!gameover)  //nếu không phải là game over
            //tác dụng gần giống return và break, nếu "không phải là game over" trả về true thì tiếp tục lặp lại animate, còn nếu trả false tức là game đã kết thúc, không cần tiếp tục vòng lặp hoạt hình nữa.

        requestAnimationFrame(animate);


    }
    animate(0);


})

