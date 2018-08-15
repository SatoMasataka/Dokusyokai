var myApp = angular.module('myApp', []);

myApp.service('CanvasService', [function () {

    var stage;
    var CanvasW = 0;
    var CanvasH = 0;

    //スクリーン下準備
	this.ScreenInit = function(canvasId,canvW,canvH){
		stage = new createjs.Stage(canvasId);
		createjs.Ticker.setFPS(60);
		createjs.Ticker.addEventListener('tick', function () { stage.update(); });
		CanvasW =canvW;
		CanvasH = canvH;

		var bg = new createjs.Shape();
        bg.graphics.beginFill("#f8f8ff").drawRect(0, 0, CanvasW, CanvasH);
        stage.addChild(bg);
		stage.update();
	
	}
	
	//オープニングシーン
	this.SceneOpening_Init = function(){
		stage.removeAllChildren();
		var bg = new createjs.Shape();
        bg.graphics.beginFill("#f8f8ff").drawRect(0, 0, CanvasW, CanvasH);
        stage.addChild(bg);

		//タイトル
		var tit1 = new createjs.Text("【第3回】\n東京のド真ん中で一風変わった本を読む\n(略して東京ド変)", "bold 50px Meiryo", "#FF0000");
        tit1.x = CanvasW / 2;
        tit1.y = CanvasH * 0.05;
        tit1.textAlign = "center";
        tit1.textBaseline = "top";
		

		//テーマ本
		var bookimg= new createjs.Bitmap("theme/themebook.png");
		bookimg.x =  CanvasW / 2;
		bookimg.y = (tit1.getMeasuredHeight() + tit1.y) *1.3;
		var sc = getScale(bookimg.image.height  , (CanvasH - bookimg.y) *0.9);
		bookimg.scaleX = sc;
		bookimg.scaleY = sc;
		bookimg.regX = bookimg.image.width/2; 
		
		stage.addChild(bookimg);
		stage.addChild(tit1);
		stage.update();

		
	}
	
	function getScale(beforeImgSize,aftImgSize){
		return aftImgSize / beforeImgSize;
	}


	/////////////////////////
	//テーマ選択スロットシーン
	//////////////////////
	var iconContainer;//アイコンコンテナ(スロット窓)

	this.SceneThemeSlot_Init = function(nokoriNum){
		stage.removeAllChildren();

		//ルーレット
		roulet= new createjs.Bitmap("img/rou.png");	
		roulet.x =  CanvasW / 2;
		roulet.y = CanvasH/2;
		roulet.regX = roulet.getBounds().width/2;
		roulet.regY = roulet.getBounds().height/2;
		var scl = getScale(roulet.getBounds().height,CanvasH*0.8);
		roulet.scaleX =scl;
		roulet.scaleY = scl;
		stage.addChild(roulet);

		var title = new createjs.Text("！テーマスロット！", "bold 50px san-serif", "#FF0000");
        title.x = CanvasW / 2;
        title.y = 0;
        title.textAlign = "center";
        title.textBaseline = "top";
		stage.addChild(title);

		var nokori = new createjs.Text("残り "+nokoriNum+"テーマ", "bold 30px san-serif", "#0000FF");
        nokori.x = CanvasW;
        nokori.y = CanvasH;
        nokori.textAlign = "right";
        nokori.textBaseline = "bottom";
		stage.addChild(nokori);		

		//アイコンコンテナセット
		iconContainer = new createjs.Container();
		iconContainer.x = CanvasW /2;
		iconContainer.y = CanvasH /2;
		iconContainer.regX = iconContainer.scaleX/2;
		iconContainer.regY = iconContainer.scaleY/2;
		stage.addChild(iconContainer);

		var startMes = new createjs.Text("ClickToStart", "bold 40px san-serif", "#58D3F7");
		startMes.textAlign = "center";
		startMes.textBaseline = "middle";
		startMes.y=CanvasH*-0.15;
		iconContainer.addChild(startMes);

		stage.update();

	}

	//ルーレット変更
	this.SceneThemeSlot_ChangeSlot = function(img_pass){
		createjs.Tween.get(roulet).to({  rotation: roulet.rotation+10 }, 10);

		//アイコンコンテナの中身リセット
		iconContainer.removeAllChildren();

		var img= new createjs.Bitmap(img_pass);
		iconContainer.addChild(img);
		img.regX = img.getBounds().width /2;
		img.regY = img.getBounds().height /2;

		var scl = getScale(img.getBounds().height,CanvasH*0.3);
		img.scaleX =scl;
		img.scaleY = scl;
		
		stage.update();
	}

	//ルーレットストップからのテーマ表示
	this.SceneThemeSlot_ThemeDisp = function(theme, userNm, userIcon){

		//todoパターンをいくつか
		var waitSec = 1500;
		var ic = createjs.Tween.get(iconContainer);
		for(var i=0;i<5;i++){
			ic.to({  alpha:0  }, waitSec/10).to({  alpha:1  }, waitSec/10);
		}
		ic.wait(waitSec).to({  rotation: 1560,scaleX:300,scaleY:300 }, 5000);

		//テーマコンテナ
		var themeContainer = new createjs.Container();
		var themebg = new createjs.Shape();
        themebg.graphics.beginFill("#000000").drawRect(0, 0, CanvasW, CanvasH);
		themeContainer.addChild(themebg);

		//テーマ
		var tmTxt = new createjs.Text(theme, "bold 60px san-serif", "#F3F781");
		tmTxt.textAlign = "center";
        tmTxt.textBaseline = "middle";
		tmTxt.x=CanvasW/2;
		tmTxt.y=CanvasH/3;
		themeContainer.addChild(tmTxt);
        
		//ユーザー名
		var nmTxt = new createjs.Text(userNm, "bold 40px san-serif", "#F3F781");
		nmTxt.textAlign = "right";
        nmTxt.textBaseline = "bottom";
		nmTxt.x=CanvasW*0.95;
		nmTxt.y=CanvasH*0.95;
		themeContainer.addChild(nmTxt);

		//ユーザーアイコン
		var img= new createjs.Bitmap(userIcon);
		img.regX = 0;
		img.regY = img.getBounds().height;
		var scl = getScale(img.getBounds().height,CanvasH*0.3);
		img.scaleX =scl;
		img.scaleY = scl;
		img.y=CanvasH;
		themeContainer.addChild(img);

		themeContainer.y=CanvasH*-1;
		stage.addChild(themeContainer);


		createjs.Tween.get(themeContainer).wait(1000).to({ y:0}, 1000);
	}
}]);


myApp.controller('mainCtrl', ['$scope', '$timeout','CanvasService','ThemeData', function ($scope,$timeout,  CanvasService,ThemeData) {

	//スクリーン状態

	var scStatusEnum={
	    ini:0,//初期化中
		op:1, //オープニング
		sl:2, //スロット初期表示
		sl_roll:5,//スロット回転中
		sl_slow:6,
		sl_stop:10,
	};
	var scStatus =scStatusEnum.ini;

	var slotItv;//スロットインターバル保持用
	var themeData=ThemeData;　//テーマデータ保持用
	var imgDir = "./theme/user_icon/";
	
    //画面初期表示
	 $scope.init = function () {
		CanvasService.ScreenInit("main-canvas", $scope.canvW, $scope.canvH);
		CanvasService.SceneOpening_Init();
		scStatus = scStatusEnum.op;
		
    }

    $scope.screenMouse = function () { //todo二重initどうにかする
	/*
		if(scStatus != scStatusEnum.ini && scStatus != scStatusEnum.op)return;
		CanvasService.SceneOpening_Init();
		scStatus = scStatusEnum.op;*/
    }
	
	//スクリーンクリックイベント
	$scope.screenClick = function(){	
		switch(scStatus){
			case scStatusEnum.op:		//オープニング⇒スロット画面
			case scStatusEnum.sl_stop:  //テーマ画面⇒スロット画面
				var nokoriNum = getNotFinThemeData().length;
				if(nokoriNum == 0) break;
				CanvasService.SceneThemeSlot_Init(nokoriNum);
				scStatus = scStatusEnum.sl;
				break;

			case scStatusEnum.sl://スロットスタート
				slotItv = setInterval(function(){
					var img_pass =getRandomIconImg();
					CanvasService.SceneThemeSlot_ChangeSlot(img_pass);
				},10);
				scStatus = scStatusEnum.sl_roll;
				break;

			case scStatusEnum.sl_roll://スロットストップ
				//ルーレットゆっくり
				clearInterval(slotItv);
				var slotItv1 = setInterval(function(){
					var img_pass =getRandomIconImg();
					CanvasService.SceneThemeSlot_ChangeSlot(img_pass);
				},100);
				scStatus =scStatusEnum.sl_slow;

				//時間差でストップ
				setTimeout(function(){
					clearInterval(slotItv1);

					//決定⇒テーマ表示演出
					var decTheme = getDecidedTheme();
					CanvasService.SceneThemeSlot_ChangeSlot(imgDir +decTheme.img);
					
					CanvasService.SceneThemeSlot_ThemeDisp(decTheme.theme, decTheme.name, imgDir + decTheme.img);
					scStatus = scStatusEnum.sl_stop;
				},2500);
				break;
			default:
				break;	
		}
	}

	//ランダムでアイコンイメージを取得
	function getRandomIconImg(){
		var idx=Math.floor( Math.random() * themeData.length);
		return imgDir + themeData[idx].img;
	}

	//テーマを決定
	function getDecidedTheme(){
		//対象のみに絞り込んでソート
		var targets =getNotFinThemeData();
		targets.sort(function(a,b){
			if(a.priority > b.priority) return -1;
			if(a.priority < b.priority) return 1;
			return (Math.random() > 0.5 ) ? 1 : -1;
		});

		//テーマ決定！
		var decTheme = targets[0];

		//終わったフラグを立てる
		for(var i = 0; i < themeData.length; i++){
			if( themeData[i] == decTheme){
				themeData[i].fin_flg = 1;
				break;
			}
		}
		return decTheme;
	}

	//終了してないテーマのみ取得
	function getNotFinThemeData(){
		return themeData.filter(function(element, index, array) {
			return (element.fin_flg != 1);
		});
	}
}]);

myApp.run(function ($rootScope) {
	$rootScope.canvW = window.innerWidth*0.95; 
	$rootScope.canvH = window.innerHeight*0.95;
});