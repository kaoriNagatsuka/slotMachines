// 先頭に文字列で'use strict'とする事で、潜在的なバグを減らす事ができる

'use strict';
// javaScriptは関数スコープのため
// 変数や関数を外から見えなくするために（カプセル化・プライベート化）
// 即時関数でスコープを閉じながら、関数内の処理をすぐに実行する 
(() => {
    // images/sprite.pngを切り取って使う際にそれぞれの笑顔のindexを指定している
    const slotImage = [
        0,  //7
        1,  //さくらんぼ
        2,  //ベル
    ];
    // images/sprite.png(スロットの画像)を切り取って使う際に
    // それぞれの絵柄のx座標を指定している。
    const SLOT_X = [
        0,  //7
        670,  //さくらんぼ
        1120,  //ベル
    ];
    // images/sprite.png(グーチョキパーの画像)を切り取って使う際に
    // それぞれの手のwidth(横幅)を指定している。
    const SLOT_WIDTH = [
        665,    //7
        446,    //さくらんぼ
        443     //ベル
    ];
    // images/sprite.png(グーチョキパーの画像)を切り取って使う際に
    // それぞれの手のheight(高さ)を指定している。
    const SLOT_HEIGHT = [
        315,  //7
        290,  //さくらんぼ
        290    //ベル
    ];
    const IMAGE_PATH = './images/strite.png';
    // 1秒間で60コマ（フレーム）のアニメーションを行う
    // ここの値が大きいほど手の切り替わりスピードが早くなる
    // 例:
    // - FPSの値が1: 1秒に1回手が切り替わる
    // - FPSの値が10: 1秒に10回手が切り替わる
    // - FPSの値が60: 1秒に60回手が切り替わる
    const FPS = 10;
    // loop関数内で呼び出しているdraw関数の実行をするかしないかを切り分けているフラグ
    // それぞれボタンが押された時にtrueになる。(buttonAction関数を参照)
    let isPause = [];
    for (let i = 0; i < slotImage.length; i++) {
        isPause[i] = false;
    }

    // draw関数が実行されるたびに1増える(インクリメント)
    // currentFrameの値を剰余算演算子(%)を使い出たあまりを使うことで、
    // 表示されるスロットの絵柄を決める。
    // 例:
    // currentFrameが30のとき: 30 % 3 => 0 => slotImage[0] => 7
    // currentFrameが31のとき: 30 % 3 => 1 => slotImage[1] => さくらんぼ
    // currentFrameが32のとき: 30 % 3 => 2 => slotImage[2] => ベル
    let currentFrame = [];

    /**
   * 実際にアニメーションを開始させる処理
   */
    const canvas1 = document.getElementById('screen1');
    const context1 = canvas1.getContext('2d');
    const canvas2 = document.getElementById('screen2');
    const context2 = canvas2.getContext('2d');
    const canvas3 = document.getElementById('screen3');
    const context3 = canvas3.getContext('2d');

    //まずは初期化。全部のスロットを真っ白にする関数
    function Initialize() {
        for (let i = 0; i < slotImage.length; i++) {
            currentFrame[i] = 0;
        }
        context1.clearRect(0, 0, canvas1.width, canvas1.height);
        context2.clearRect(0, 0, canvas2.width, canvas2.height);
        context3.clearRect(0, 0, canvas3.width, canvas3.height);
    }
    function main() {
        const imageObj = new Image();

        imageObj.src = IMAGE_PATH;
        imageObj.onload = function () {
            function loop() {
                if (!isPause[0]) {
                    draw(canvas1, context1, imageObj, currentFrame[0]++);
                }
                if (!isPause[1]) {
                    draw(canvas2, context2, imageObj, currentFrame[1]++);
                }
                if (!isPause[2]) {
                    draw(canvas3, context3, imageObj, currentFrame[2]++);
                }
                // 指定した時間が経過したらloop関数を呼び出す。
                // 関数自身を呼び出す関数のことを再帰関数という。
                //
                // 例: FPSの値に応じてloop関数が実行される時間間隔が変わる
                // FPSが60 => 1000/60 => 16.666 => 0.016秒後にloop関数を実行 => 0.016秒毎に1回手が切り替わる
                // FPSが10 => 1000/10 => 100 => 0.1秒後にloop関数を実行 => 0.1秒毎に1回手が切り替わる
                // FPSが1 => 1000/1 => 1000 => 1秒後にloop関数を実行 => 1秒毎に1回手が切り替わる
                setTimeout(loop, 1000 / FPS);
            }
            loop();
        };
    }
    /**
   * スロットの絵柄の画像('./images/sprite.png')から特定の手の形を切り取る
   * @param {*} canvas HTMLのcanvas要素
   * @param {*} context canvasから取得した値。この値を使うことでcanvasに画像や図形を描画することが出来る
   * @param {*} imageObject 画像データ。
   * @param {*} frame 現在のフレーム数(コマ数)。フレーム % HAND_FORMS.lengthによって0(７), 1(さくらんぼ), 2(ベル)を決める
   */
    function draw(canvas, context, imageObject, frame) {
        // HTML5から導入されたcanvasをJavaScriptを使って画像の切り替えを行っている。
        // - Canvas API: https://developer.mozilla.org/ja/docs/Web/HTML/Canvas
        // - CanvasRenderingContext2D: https://developer.mozilla.org/ja/docs/Web/API/CanvasRenderingContext2D

        // Canvasをまっさらな状態にする。（クリアする）
        // クリアをしなかった場合、以前に描画した画像がcanvas上に残ったままになってしまう。
        context.clearRect(0, 0, canvas.width, canvas.height);
        // 0:７ 1:さくらんぼ 2:ベル
        const slotIndex = frame % slotImage.length;
        const sx = SLOT_X[slotIndex];
        const swidth = SLOT_WIDTH[slotIndex];
        const sheight = SLOT_HEIGHT[slotIndex];
        // 画像のx座標(sx)と指定した画像の横縦幅(swidth)(sheight)を使って、
        // スロット画像('./images/sprite.png')から特定の絵を切り取る
        context.drawImage(
            imageObject,
            sx,
            30,
            swidth,
            sheight,
            0,
            0,
            canvas.width,
            canvas.height
        );
    }
    // ボタンが何回押されたかを示す変数
    // 1回目　＝＝＞　ボタンのcontextをstartからstopに変える。全てのisPauseをfalseにしてmain()を呼んで全てスロットを動かす
    // 2回目　＝＝＞　左のスロットを止める(isPause[0]=true)
    // 3回目　＝＝＞　真ん中のスロットを止める(isPause[1]=true)
    // 4回目　＝＝＞　右のスロットを止め(isPause[2]=true)、判定を行う(judge())。ボタンのcontextをstopからRestartに変える。
    // 5回目　＝＝＞　リロードする

    function buttonAction() {
        const button = document.querySelector('button');
        let buttonIndex = 0;
        button.addEventListener('click', (event) => {
            switch (buttonIndex) {
                case 0:
                    button.textContent = 'stop';
                    for (let i = 0; i < slotImage.length; i++) {
                        isPause[i] = false;
                    }
                    main();
                    buttonIndex++;
                    break;
                case 1:
                    isPause[0] = true;
                    buttonIndex++;
                    break;
                case 2:
                    isPause[1] = true;
                    buttonIndex++;
                    break;
                case 3:
                    isPause[2] = true;
                    judge(currentFrame[0], currentFrame[1], currentFrame[2]);
                    button.textContent = 'Restart';
                    buttonIndex++;
                    break;
                case 4:
                    window.location.reload();
                    break;
            }
        });
    }
    // 判定するための関数　3つ全ての絵柄が同じ時が当たり。それ以外を外れとしている。
    function judge(frame1, frame2, frame3) {
        const slot1Index = frame1 % slotImage.length;
        const slot2Index = frame2 % slotImage.length;
        const slot3Index = frame3 % slotImage.length;
        if (slot1Index === slot2Index && slot1Index === slot3Index) {
            alert('当たりです！');
        } else {
            alert('残念');
        }
    }
    Initialize();
    buttonAction();
})();
