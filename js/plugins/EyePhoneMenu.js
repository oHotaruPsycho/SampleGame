//=============================================================================
// Scene_Boot 初回ロード追加の為の「Scene_Boot.create」メソッドの再定義
//=============================================================================

//Scene_Bootが稼動した時に実行しているメソッド
var scuneBootCreate = Scene_Boot.prototype.create;
Scene_Boot.prototype.create = function() {
    scuneBootCreate.call(this);
    //③ ①で作ったメソッドの呼び出し
    this.loadOriginalImages();
};

//① ③で読み込むオリジナル画像読み込みメソッド
Scene_Boot.prototype.loadOriginalImages = function() {
    //Menu
    ImageManager.loadPicture('gameEnd_icon');
    ImageManager.loadPicture('train_icon');
    ImageManager.loadPicture('syabetta_icon');
    ImageManager.loadPicture('save_icon');
    ImageManager.loadPicture('memo_icon');
    ImageManager.loadPicture('item_icon');
    ImageManager.loadPicture('call_icon');
    ImageManager.loadPicture('act_icon');
    ImageManager.loadPicture('options_icon');
    //Act
    ImageManager.loadPicture('ado');
    ImageManager.loadPicture('dave');
    ImageManager.loadPicture('nico');
    ImageManager.loadPicture('sco');
    ImageManager.loadPicture('jack');
    ImageManager.loadPicture('sese');
    ImageManager.loadPicture('chak');
    ImageManager.loadPicture('nath');
    ImageManager.loadPicture('reo');
    //アニメーション用（敵）
    ImageManager.loadEnemy('Bat1');
};
// ヘルプウィンドウの作成
Scene_MenuBase.prototype.createHelpWindow = function() {
    this._helpWindow = new Window_Help(14);
    this._helpWindow.x = 343;
    this._helpWindow.y = 20;
    this._helpWindow.width = Graphics.boxWidth - this._helpWindow.x;
    this._helpWindow.height = 540;
    this.addWindow(this._helpWindow);
};

Scene_ItemBase.prototype.itemTargetActors = function() {
    var action = new Game_Action(this.user());
    action.setItemObject(this.item());
    if (!action.isForFriend()) {
        return [];
    } else if (action.isForAll()) {
        return $gameParty.members();
    } else {
        return [$gameParty.members()[this._actorWindow.index() == -1 ? 0 : this._actorWindow.index()]];
    }
};

Scene_ItemBase.prototype.createBackground = function() {
    this._backgroundSprite = new Sprite();
    this._backgroundSprite.bitmap = SceneManager.backgroundBitmap();
    this.addChild(this._backgroundSprite);
    this._backgroundSprite1 = new Sprite();
    this._backgroundSprite1.bitmap = ImageManager.loadPicture("eyephone1");
    this._backgroundSprite1.x = 0;
    this._backgroundSprite1.y = 20;
    this.addChild(this._backgroundSprite1);
    this._backgroundSprite2 = new Sprite();
    this._backgroundSprite2.bitmap = ImageManager.loadPicture("eyephone2");
    this._backgroundSprite2.x = 0;
    this._backgroundSprite2.y = 20;
    this.addChild(this._backgroundSprite2);
    this._backgroundSprite3 = new Sprite();
    this._backgroundSprite3.bitmap = ImageManager.loadPicture("eyephone3");
    this._backgroundSprite3.x = 0;
    this._backgroundSprite3.y = 20;
    this.addChild(this._backgroundSprite3);
};

//①Scene_Map.callMenu処理をオーバーライド
Scene_Map.prototype.callMenu = function() {

    //②データベース側で設定されているOK処理の時のサウンドを鳴らす
    SoundManager.playOk();

    //③pushメソッドの引数に指定したシーンを呼び出す
    SceneManager.push(Scene_EyePhone_Menu);
};



//=============================================================================
// Window_Help メソッド修正
//=============================================================================
Window_Help.prototype.initialize = function(numLines) {
    var width = Graphics.boxWidth;
    var height = this.fittingHeight(numLines || 2);
    Window_Base.prototype.initialize.call(this, 0, 0, width, height);
    this._text = '';
};

//============================
// EyePhoneメニューシーン
//============================
function Scene_EyePhone_Menu() {
    this.initialize.apply(this, arguments);
}

Scene_EyePhone_Menu.prototype = Object.create(Scene_MenuBase.prototype);

//⑦オブジェクトが生成された時のコンストラクタ
Scene_EyePhone_Menu.prototype.constructor = Scene_EyePhone_Menu;

//⑧初期化
Scene_EyePhone_Menu.prototype.initialize = function() {
    Scene_MenuBase.prototype.initialize.call(this);
    this.backOpacity = 0;
    this.opacity = 0;
};


//生成メソッド
Scene_EyePhone_Menu.prototype.create = function() {
    Scene_MenuBase.prototype.create.call(this);
    
    //⑤　①で作ったウィンドウ生成関数を呼び出す
    this.createHelpWindow();
    this.createMenuWindow();
};

//メニューウィンドウ生成
Scene_EyePhone_Menu.prototype.createMenuWindow = function() {

    //① メニューコマンド用のWindowクラスを作成
    this._menuWindow = new Window_MenuCommand(44,65 + 20);

    this._menuWindow.backOpacity = 0;
    this._menuWindow.opacity = 0;
    //② アイテムを選んだときの処理を指定
    this._menuWindow.setHandler('item', this.commandItem.bind(this));
    //② アクトを選んだときの処理を指定
    this._menuWindow.setHandler('act', this.commandAct.bind(this));
    //② 電話を選んだときの処理を指定
    this._menuWindow.setHandler('call', this.commandItem.bind(this));
    //② 電車を選んだときの処理を指定
    this._menuWindow.setHandler('train', this.commandItem.bind(this));
    //② しゃべったーを選んだときの処理を指定
    this._menuWindow.setHandler('syabetta', this.commandItem.bind(this));
    //② メモを選んだときの処理を指定
    this._menuWindow.setHandler('memo', this.commandMemo.bind(this));
    //⑦ オプションを選んだときの処理を指定
    this._menuWindow.setHandler('options', this.commandOptions.bind(this));
    //⑧ セーブを選んだときの処理を指定
    this._menuWindow.setHandler('save', this.commandSave.bind(this));
    //⑧ ゲーム終了を選んだときの処理を指定
    this._menuWindow.setHandler('gameEnd', this.commandGameEnd.bind(this));
    //⑨ キャンセルを選んだときの処理を指定
    this._menuWindow.setHandler('cancel', this.popScene.bind(this));
    this._menuWindow.setHelpWindow(this._helpWindow);
    this.addWindow(this._menuWindow);
}

//アイテムが選ばれた時の処理の内容
Scene_EyePhone_Menu.prototype.commandItem = function() {
    //アイテムウィンドウシーンを呼び出す
    SceneManager.push(Scene_Item2);
};
//メモが選ばれた時の処理の内容
Scene_EyePhone_Menu.prototype.commandMemo = function() {
    //メモウィンドウシーンを呼び出す
    SceneManager.push(Scene_Memo);
};
//メモが選ばれた時の処理の内容
Scene_EyePhone_Menu.prototype.commandAct = function() {
    //メモウィンドウシーンを呼び出す
    SceneManager.push(Scene_Act);
};
//オプションが選ばれた時の処理の内容
Scene_EyePhone_Menu.prototype.commandOptions = function() {
    //オプションウィンドウシーンを呼び出す
    SceneManager.push(Scene_Options2);
};
//セーブが選ばれた時の処理の内容
Scene_EyePhone_Menu.prototype.commandSave = function() {
    //セーブウィンドウシーンを呼び出す
    SceneManager.push(Scene_Save2);
};
//ゲーム終了が選ばれた時の処理の内容
Scene_EyePhone_Menu.prototype.commandGameEnd = function() {
    //ゲーム終了ウィンドウシーンを呼び出す
    SceneManager.push(Scene_GameEnd);
};
Scene_EyePhone_Menu.prototype.createBackground = function() {
    this._backgroundSprite = new Sprite();
    this._backgroundSprite.bitmap = SceneManager.backgroundBitmap();
    this.addChild(this._backgroundSprite);
    this._backgroundSprite1 = new Sprite();
    this._backgroundSprite1.bitmap = ImageManager.loadPicture("eyephone1");
    this._backgroundSprite1.x = 0;
    this._backgroundSprite1.y = 20;
    this.addChild(this._backgroundSprite1);
    this._backgroundSprite2 = new Sprite();
    this._backgroundSprite2.bitmap = ImageManager.loadPicture("eyephone2");
    this._backgroundSprite2.x = 0;
    this._backgroundSprite2.y = 20;
    this.addChild(this._backgroundSprite2);
    this._backgroundSprite3 = new Sprite();
    this._backgroundSprite3.bitmap = ImageManager.loadPicture("eyephone3");
    this._backgroundSprite3.x = 0;
    this._backgroundSprite3.y = 20;
    this.addChild(this._backgroundSprite3);
};


//=============================================================================
// Window_MenuCommand メソッド追加
//=============================================================================

Window_MenuCommand.prototype.makeCommandList = function() {
    this.addMainCommands();
    this.addOriginalCommands();
    this.addOptionsCommand();
    this.addGameEndCommand();

};

Window_MenuCommand.prototype.addMainCommands = function() {
    var enabled = this.areMainCommandsEnabled();
    if (this.needsCommand('item')){
        this.addCommand('', 'item', enabled);
    }
};

Window_MenuCommand.prototype.addFormationCommand = function() {
};

Window_MenuCommand.prototype.addOriginalCommands = function() {
    this.addCommand('アクト', 'act', true);
    //this.addCommand('コール', 'call', true);
    //this.addCommand('シャベッター', 'syabetta', true);
    this.addCommand('メモ', 'memo', true);
    if($gameSwitches.value(1)){
        this.addCommand('トレイン', 'train', true);
        this.addSaveCommand();
    }
};

Window_MenuCommand.prototype.addSaveCommand = function() {
    if (this.needsCommand('save')) {
        var enabled = this.isSaveEnabled();
        this.addCommand(TextManager.save, 'save', enabled);
    }
};

Window_MenuCommand.prototype.drawItem = function(index) {
    var rect = this.itemRectForText(index);
    var align = this.itemTextAlign();
    this.resetTextColor();
    this.changePaintOpacity(this.isCommandEnabled(index));
    this.drawIcon(index, rect.x-4,rect.y + 4);
};

Window_MenuCommand.prototype.drawIcon = function(iconIndex, x, y) {
    var symbol = this.commandSymbol(iconIndex);
    var bitmap = ImageManager.loadPicture(symbol + '_icon');
    this.contents.blt(bitmap, 0, 0, 72, 78, x, y );
}; 

Window_MenuCommand.prototype.windowWidth = function() {
    return  Math.ceil(81* this.maxCols());
};

Window_MenuCommand.prototype.lineHeight = function() {
    return 82;
};

Window_MenuCommand.prototype.maxCols = function() {
    return 3;
};

Window_MenuCommand.prototype.standardPadding = function() {
    return 2;
};

Window_MenuCommand.prototype.fittingHeight = function(numLines) {
    return numLines * this.lineHeight() + (numLines - 1) * 10 + this.standardPadding() * 2;
};

Window_MenuCommand.prototype.updateHelp = function() {
    this._helpWindow.clear();
    var helpText = '';
    switch(this.commandSymbol(this._index)) {
        case 'item'://\n
            helpText = 'アイテムを選択します。';
            break;
        case 'act'://\n
            helpText = '特殊能力を選択します。';
            break;
        case 'call'://\n
            helpText = '誰かと連絡を取ることができます。';
            break;
        case 'train'://\n
            helpText = '電車に移動します。';
            break;
        case 'syabetta'://\n
            helpText = '開発中';
            break;
        case 'memo'://\n
            helpText = 'メモを表示します。';
            break;
        case 'options'://\n
            helpText = '設定を行います。';
            break;
        case 'save'://\n
            helpText = 'セーブを行います。';
            break;
        case 'gameEnd'://\n
            helpText = 'ゲームを終了します。';
            break;
        default:
            break;
    }
    this._helpWindow.setText(helpText);
};

Window_MenuCommand.prototype.select = function(index) {
    this._index = index;
    this._stayCount = 0;
    this.ensureCursorVisible();
    this.updateCursor();
    this.callUpdateHelp();
};

//=============================================================================
// Scene_Options クラスを派生
//=============================================================================
function Scene_Options2() {
    this.initialize.apply(this, arguments);
}

Scene_Options2.prototype = Object.create(Scene_Options.prototype);
Scene_Options2.prototype.constructor = Scene_Options2;

Scene_Options2.prototype.initialize = function() {
    Scene_Options.prototype.initialize.call(this);
};

Scene_Options2.prototype.createOptionsWindow = function() {
    this._optionsWindow = new Window_Options2();
    this._optionsWindow.setHandler('cancel', this.popScene.bind(this));
    this.addWindow(this._optionsWindow);
};

function Window_Options2() {
    this.initialize.apply(this, arguments);
    this.backOpacity = 0;
    this.opacity = 0;
}

Window_Options2.prototype = Object.create(Window_Options.prototype);
Window_Options2.prototype.constructor = Window_Options2;

Window_Options2.prototype.updatePlacement = function() {
    this.x = 21;
    this.y = 78;
};

Window_Options2.prototype.windowWidth = function() {
    return 290;
};

Scene_Options2.prototype.createBackground = function() {
    this._backgroundSprite = new Sprite();
    this._backgroundSprite.bitmap = SceneManager.backgroundBitmap();
    this.addChild(this._backgroundSprite);
    this._backgroundSprite1 = new Sprite();
    this._backgroundSprite1.bitmap = ImageManager.loadPicture("eyephone1");
    this._backgroundSprite1.x = 0;
    this._backgroundSprite1.y = 20;
    this.addChild(this._backgroundSprite1);
    this._backgroundSprite2 = new Sprite();
    this._backgroundSprite2.bitmap = ImageManager.loadPicture("eyephone2");
    this._backgroundSprite2.x = 0;
    this._backgroundSprite2.y = 20;
    this.addChild(this._backgroundSprite2);
    this._backgroundSprite3 = new Sprite();
    this._backgroundSprite3.bitmap = ImageManager.loadPicture("eyephone3");
    this._backgroundSprite3.x = 0;
    this._backgroundSprite3.y = 20;
    this.addChild(this._backgroundSprite3);
};

//=============================================================================
// Scene_Act クラスを派生
//=============================================================================

function Scene_Act() {
    this.initialize.apply(this, arguments);
}

Scene_Act.prototype = Object.create(Scene_ItemBase.prototype);
Scene_Act.prototype.constructor = Scene_Act;

Scene_Act.prototype.initialize = function() {
    Scene_ItemBase.prototype.initialize.call(this);
};

Scene_Act.prototype.create = function() {
    Scene_ItemBase.prototype.create.call(this);
    this.createHelpWindow();
    this.createItemWindow();
    this.createActorWindow();
    this._itemWindow.setCategory('memo');
    this.onCategoryOk();
};

Scene_Act.prototype.createItemWindow = function() {
    var wy = 88;
    var wh = 400;
    this._itemWindow = new Window_ActList(46, wy, 240, wh);
    this._itemWindow.setHelpWindow(this._helpWindow);
    this._itemWindow.setHandler('ok',     this.onItemOk.bind(this));
    this._itemWindow.setHandler('cancel', this.popScene.bind(this));
    this.addWindow(this._itemWindow);
};

Scene_Act.prototype.user = function() {
    var members = $gameParty.movableMembers();
    var bestActor = members[0];
    var bestPha = 0;
    for (var i = 0; i < members.length; i++) {
        if (members[i].pha > bestPha) {
            bestPha = members[i].pha;
            bestActor = members[i];
        }
    }
    return bestActor;
};

Scene_Act.prototype.onCategoryOk = function() {
    this._itemWindow.activate();
    this._itemWindow.selectLast();
};

Scene_Act.prototype.onItemOk = function() {
    this.popScene();
    this.popScene();
};

Scene_Act.prototype.playSeForItem = function() {
    SoundManager.playUseItem();
};

Scene_Act.prototype.createBackground = function() {
    this._backgroundSprite = new Sprite();
    this._backgroundSprite.bitmap = SceneManager.backgroundBitmap();
    this.addChild(this._backgroundSprite);
    this._backgroundSprite1 = new Sprite();
    this._backgroundSprite1.bitmap = ImageManager.loadPicture("eyephone1");
    this._backgroundSprite1.x = 0;
    this._backgroundSprite1.y = 20;
    this.addChild(this._backgroundSprite1);
    this._backgroundSprite2 = new Sprite();
    this._backgroundSprite2.bitmap = ImageManager.loadPicture("eyephone2_2");
    this._backgroundSprite2.x = 0;
    this._backgroundSprite2.y = 20;
    this.addChild(this._backgroundSprite2);
    this._backgroundSprite3 = new Sprite();
    this._backgroundSprite3.bitmap = ImageManager.loadPicture("eyephone3");
    this._backgroundSprite3.x = 0;
    this._backgroundSprite3.y = 20;
    this.addChild(this._backgroundSprite3);
};

//=============================================================================
// Window_SavefileList クラスを派生
//=============================================================================
function Window_SavefileList2() {
    this.initialize.apply(this, arguments);
}

Window_SavefileList2.prototype = Object.create(Window_Selectable.prototype);
Window_SavefileList2.prototype.constructor = Window_SavefileList2;

Window_SavefileList2.prototype.initialize = function(x, y, width, height) {
    Window_Selectable.prototype.initialize.call(this, x, y, width, height);
    this.activate();
    this._mode = null;
};

/**
変更点１
*/
Window_SavefileList2.prototype.standardBackOpacity = function() {
    this.backFrameOpacity = 0;
    return 0;
};

Window_SavefileList2.prototype.setMode = function(mode) {
    this._mode = mode;
};

Window_SavefileList2.prototype.maxItems = function() {
    return DataManager.maxSavefiles();
};

Window_SavefileList2.prototype.maxVisibleItems = function() {
    return 5;
};

Window_SavefileList2.prototype.itemHeight = function() {
    var innerHeight = this.height - this.padding * 2;
    return Math.floor(innerHeight / this.maxVisibleItems());
};

Window_SavefileList2.prototype.drawItem = function(index) {
    var id = index + 1;
    var valid = DataManager.isThisGameFile(id);
    var info = DataManager.loadSavefileInfo(id);
    var rect = this.itemRectForText(index);
    this.resetTextColor();
    if (this._mode === 'load') {
        this.changePaintOpacity(valid);
    }
    this.setFontSize(18);
    this.drawFileId(id, rect.x, rect.y);
    if (info) {
        this.changePaintOpacity(valid);
        this.drawContents(info, rect, valid);
        this.changePaintOpacity(true);
    }
    this.setFontSize(28);
};

// 変更点２
Window_SavefileList2.prototype.drawFileId = function(id, x, y) {
    this.drawText(TextManager.file + ' ' + id, x, y, 90);
};

// 変更点3
Window_SavefileList2.prototype.drawContents = function(info, rect, valid) {
    this.drawPlaytime(info, rect.x, rect.y, rect.width);
    var bottom = rect.y + rect.height;
    if (rect.width >= 420) {
        this.drawGameTitle(info, rect.x + 192, rect.y, rect.width - 192);
    }
    var lineHeight = this.lineHeight();
    var y2 = bottom - lineHeight;
    // マップ名を表示する
    this.drawLocation(info, rect.x, y2, rect.width);
};

Window_SavefileList2.prototype.drawGameTitle = function(info, x, y, width) {
    if (info.title) {
        this.drawText(info.title, x, y, width);
    }
};

Window_SavefileList2.prototype.drawPartyCharacters = function(info, x, y) {
    if (info.characters) {
        for (var i = 0; i < info.characters.length; i++) {
            var data = info.characters[i];
            this.drawCharacter(data[0], data[1], x + i * 48, y);
        }
    }
};

// 変更点4
Window_SavefileList2.prototype.drawPlaytime = function(info, x, y, width) {
    if (info.playtime) {
        this.drawText(info.playtime, x, y, width, 'right');
    }
};

// 変更点5
Window_SavefileList2.prototype.drawLocation = function(info, x, y, width) {
    if (info.location) {
        this.drawText(info.location, x, y, width, 'left');
    }
};

/**
変更点6
*/
Window_SavefileList2.prototype.setFontSize = function(size) {
    this.contents.fontSize = size;
};


/**
変更点7
*/
Window_SavefileList2.prototype.lineHeight = function() {
    return 40;
};

Window_SavefileList2.prototype.playOkSound = function() {
};




//=============================================================================
// Scene_File クラスを派生
//=============================================================================
function Scene_File2() {
    this.initialize.apply(this, arguments);
}

Scene_File2.prototype = Object.create(Scene_MenuBase.prototype);
Scene_File2.prototype.constructor = Scene_File2;

Scene_File2.prototype.initialize = function() {
    Scene_MenuBase.prototype.initialize.call(this);
};
Scene_File2.prototype.createBackground = function() {
    this._backgroundSprite = new Sprite();
    this._backgroundSprite.bitmap = SceneManager.backgroundBitmap();
    this.addChild(this._backgroundSprite);
    // 以下追加
    this._backgroundSprite1 = new Sprite();
    this._backgroundSprite1.bitmap = ImageManager.loadPicture("eyephone1");
    this._backgroundSprite1.x = 0;
    this._backgroundSprite1.y = 20;
    this.addChild(this._backgroundSprite1);
    this._backgroundSprite2 = new Sprite();
    this._backgroundSprite2.bitmap = ImageManager.loadPicture("eyephone2");
    this._backgroundSprite2.x = 0;
    this._backgroundSprite2.y = 20;
    this.addChild(this._backgroundSprite2);
    this._backgroundSprite3 = new Sprite();
    this._backgroundSprite3.bitmap = ImageManager.loadPicture("eyephone3");
    this._backgroundSprite3.x = 0;
    this._backgroundSprite3.y = 20;
    this.addChild(this._backgroundSprite3);
};

Scene_File2.prototype.create = function() {
    Scene_MenuBase.prototype.create.call(this);
    DataManager.loadAllSavefileImages();
    this.createHelpWindow();
    this.createListWindow();
};

Scene_File2.prototype.start = function() {
    Scene_MenuBase.prototype.start.call(this);
    this._listWindow.refresh();
};

Scene_File2.prototype.savefileId = function() {
    return this._listWindow.index() + 1;
};

// ヘルプウィンドウの作成
Scene_File2.prototype.createHelpWindow = function() {
    this._helpWindow = new Window_Help(14);
    this._helpWindow.x = 343;
    this._helpWindow.y = 20;
    this._helpWindow.width = Graphics.boxWidth - this._helpWindow.x;
    this._helpWindow.height = 540;
    this._helpWindow.setText(this.helpWindowText());
    this.addWindow(this._helpWindow);
};

Scene_File2.prototype.createListWindow = function() {
    var x = 22;
    var y = 68;
    var width = 290;
    var height = 380;
    this._listWindow = new Window_SavefileList2(x, y, width, height);
    this._listWindow.setHandler('ok',     this.onSavefileOk.bind(this));
    this._listWindow.setHandler('cancel', this.popScene.bind(this));
    this._listWindow.select(this.firstSavefileIndex());
    this._listWindow.setTopRow(this.firstSavefileIndex() - 2);
    this._listWindow.setMode(this.mode());
    this._listWindow.refresh();
    this.addWindow(this._listWindow);
};

Scene_File2.prototype.mode = function() {
    return null;
};

Scene_File2.prototype.activateListWindow = function() {
    this._listWindow.activate();
};

Scene_File2.prototype.helpWindowText = function() {
    return '';
};

Scene_File2.prototype.firstSavefileIndex = function() {
    return 0;
};

Scene_File2.prototype.onSavefileOk = function() {
};




//=============================================================================
// Scene_Save クラスを派生
//=============================================================================

function Scene_Save2() {
    this.initialize.apply(this, arguments);
}

Scene_Save2.prototype = Object.create(Scene_File2.prototype);
Scene_Save2.prototype.constructor = Scene_Save2;

Scene_Save2.prototype.initialize = function() {
    Scene_File2.prototype.initialize.call(this);
};

Scene_Save2.prototype.mode = function() {
    return 'save';
};

Scene_Save2.prototype.helpWindowText = function() {
    return TextManager.saveMessage;
};

Scene_Save2.prototype.firstSavefileIndex = function() {
    return DataManager.lastAccessedSavefileId() - 1;
};

Scene_Save2.prototype.onSavefileOk = function() {
    Scene_File2.prototype.onSavefileOk.call(this);
    $gameSystem.onBeforeSave();
    if (DataManager.saveGame(this.savefileId())) {
        this.onSaveSuccess();
    } else {
        this.onSaveFailure();
    }
};

Scene_Save2.prototype.onSaveSuccess = function() {
    SoundManager.playSave();
    StorageManager.cleanBackup(this.savefileId());
    this.popScene();
};

Scene_Save2.prototype.onSaveFailure = function() {
    SoundManager.playBuzzer();
    this.activateListWindow();
};

Scene_Save2.prototype.createBackground = function() {
    this._backgroundSprite = new Sprite();
    this._backgroundSprite.bitmap = SceneManager.backgroundBitmap();
    this.addChild(this._backgroundSprite);
    this._backgroundSprite1 = new Sprite();
    this._backgroundSprite1.bitmap = ImageManager.loadPicture("eyephone1");
    this._backgroundSprite1.x = 0;
    this._backgroundSprite1.y = 20;
    this.addChild(this._backgroundSprite1);
    this._backgroundSprite2 = new Sprite();
    this._backgroundSprite2.bitmap = ImageManager.loadPicture("eyephone2");
    this._backgroundSprite2.x = 0;
    this._backgroundSprite2.y = 20;
    this.addChild(this._backgroundSprite2);
    this._backgroundSprite3 = new Sprite();
    this._backgroundSprite3.bitmap = ImageManager.loadPicture("eyephone3");
    this._backgroundSprite3.x = 0;
    this._backgroundSprite3.y = 20;
    this.addChild(this._backgroundSprite3);
};


//=============================================================================
// Scene_Item クラスを派生
//=============================================================================

function Scene_Item2() {
    this.initialize.apply(this, arguments);
}

Scene_Item2.prototype = Object.create(Scene_ItemBase.prototype);
Scene_Item2.prototype.constructor = Scene_Item2;

Scene_Item2.prototype.initialize = function() {
    Scene_ItemBase.prototype.initialize.call(this);
};

Scene_Item2.prototype.create = function() {
    Scene_ItemBase.prototype.create.call(this);
    this.createHelpWindow();
    this.createItemWindow();
    this.createActorWindow();
    this._itemWindow.setCategory(this._itemWindow._categories[0]);
    this._itemWindow._cgIndex = 0;
    this.onCategoryOk();
};

Scene_Item2.prototype.createCategoryWindow = function() {
    this._categoryWindow = new Window_ItemCategory();
    this._categoryWindow.setHelpWindow(this._helpWindow);
    this._categoryWindow.y = this._helpWindow.height;
    this._categoryWindow.setHandler('ok',     this.onCategoryOk.bind(this));
    this._categoryWindow.setHandler('cancel', this.popScene.bind(this));
    this.addWindow(this._categoryWindow);
};

Scene_Item2.prototype.createItemWindow = function() {
    var wy = 70;
    var wh = 360;
    this._itemWindow = new Window_ItemList(25, wy, 280, wh);
    this._itemWindow.setHelpWindow(this._helpWindow);
    this._itemWindow.setHandler('ok',     this.onItemOk.bind(this));
    this._itemWindow.setHandler('cancel', this.popScene.bind(this));
    this.addWindow(this._itemWindow);
    //this._categoryWindow.setItemWindow(this._itemWindow);
};

Scene_Item2.prototype.user = function() {
    var members = $gameParty.movableMembers();
    var bestActor = members[0];
    var bestPha = 0;
    for (var i = 0; i < members.length; i++) {
        if (members[i].pha > bestPha) {
            bestPha = members[i].pha;
            bestActor = members[i];
        }
    }
    return bestActor;
};

Scene_Item2.prototype.onCategoryOk = function() {
    this._itemWindow.activate();
    this._itemWindow.selectLast();
};

Scene_Item2.prototype.onItemOk = function() {
    if(this.item().meta.Back){
        this.popScene();
    }else if(this._itemWindow._category == 'weapon'){
        var item = this.item();
        if($gameActors._data[1]._equips[0].object() == item){
            item = null;
        }
        this.actor().changeEquip(0, item);
        //this.update();
        //this.popScene();
    }else{
        if(this.item().meta.Impressions){
            $gameMessage.add(this.item().meta.Impressions);
        }
        this.useItem();
        this.popScene();
        this.popScene();
    }
};

Scene_Item2.prototype.onItemCancel = function() {
    this._itemWindow.deselect();
    this._categoryWindow.activate();
};

Scene_Item2.prototype.playSeForItem = function() {
    SoundManager.playUseItem();
};

Scene_Item2.prototype.useItem = function() {
    Scene_ItemBase.prototype.useItem.call(this);
    this._itemWindow.redrawCurrentItem();
};

//=============================================================================
// Scene_Memo クラスを派生
//=============================================================================

function Scene_Memo() {
    this.initialize.apply(this, arguments);
}

Scene_Memo.prototype = Object.create(Scene_ItemBase.prototype);
Scene_Memo.prototype.constructor = Scene_Item2;

Scene_Memo.prototype.initialize = function() {
    Scene_ItemBase.prototype.initialize.call(this);
};

Scene_Memo.prototype.create = function() {
    Scene_ItemBase.prototype.create.call(this);
    this.createHelpWindow();
    this.createItemWindow();
    this.createActorWindow();
    this._itemWindow.setCategory('memo');
    this.onCategoryOk();
};

Scene_Memo.prototype.createItemWindow = function() {
    var wy = 70;
    var wh = 360;
    this._itemWindow = new Window_MemoList(25, wy, 280, wh);
    this._itemWindow.setHelpWindow(this._helpWindow);
    this._itemWindow.setHandler('ok',     this.onItemOk.bind(this));
    this._itemWindow.setHandler('cancel', this.popScene.bind(this));
    this.addWindow(this._itemWindow);
};

Scene_Memo.prototype.user = function() {
    var members = $gameParty.movableMembers();
    var bestActor = members[0];
    var bestPha = 0;
    for (var i = 0; i < members.length; i++) {
        if (members[i].pha > bestPha) {
            bestPha = members[i].pha;
            bestActor = members[i];
        }
    }
    return bestActor;
};

Scene_Memo.prototype.onCategoryOk = function() {
    this._itemWindow.activate();
    this._itemWindow.selectLast();
};

Scene_Memo.prototype.onItemOk = function() {
    if(this.item().meta.Back){
        this.popScene();
    }
};

Scene_Memo.prototype.playSeForItem = function() {
    SoundManager.playUseItem();
};

Scene_Memo.prototype.useItem = function() {
    Scene_ItemBase.prototype.useItem.call(this);
    this._itemWindow.redrawCurrentItem();
};

Scene_GameEnd.prototype.createBackground = function() {
    this._backgroundSprite = new Sprite();
    this._backgroundSprite.bitmap = SceneManager.backgroundBitmap();
    this.addChild(this._backgroundSprite);
    this._backgroundSprite1 = new Sprite();
    this._backgroundSprite1.bitmap = ImageManager.loadPicture("eyephone1");
    this._backgroundSprite1.x = 0;
    this._backgroundSprite1.y = 20;
    this.addChild(this._backgroundSprite1);
    this._backgroundSprite2 = new Sprite();
    this._backgroundSprite2.bitmap = ImageManager.loadPicture("eyephone2");
    this._backgroundSprite2.x = 0;
    this._backgroundSprite2.y = 20;
    this.addChild(this._backgroundSprite2);
    this._backgroundSprite3 = new Sprite();
    this._backgroundSprite3.bitmap = ImageManager.loadPicture("eyephone3");
    this._backgroundSprite3.x = 0;
    this._backgroundSprite3.y = 20;
    this.addChild(this._backgroundSprite3);
};

Window_GameEnd.prototype.updatePlacement = function() {
    this.x = 45;
    this.y = 180;
};


//=============================================================================
// Window_ItemCategory メソッド修正
//=============================================================================
Window_ItemCategory.prototype.standardBackOpacity = function() {
    this.backFrameOpacity = 0;
    return 0;
};



//=============================================================================
// Window_ItemList メソッド修正
//=============================================================================
Window_ItemList.prototype.initialize = function(x, y, width, height) {
    Window_Selectable.prototype.initialize.call(this, x, y, width, height);
    this._categories = {0:'food', 1:'weapon',2:'keyItem'};
    this._category = 'none';
    this._cgIndex = -1;
    this._data = [];
};

Window_ItemList.prototype.includes = function(item) {
    switch (this._category) {
    case 'food':
        return DataManager.isItem(item) && !item.meta.Memo && item.meta.Food;
    case 'item':
        return DataManager.isItem(item) && !item.meta.Memo && !item.meta.Food && item.itypeId === 1;
    case 'weapon':
        return DataManager.isWeapon(item);
    case 'armor':
        return DataManager.isArmor(item);
    case 'keyItem':
        return DataManager.isItem(item) && item.itypeId === 2;
    default:
        return false;
    }
};

Window_ItemList.prototype.setCategory = function(category) {
    if (this._category !== category) {
        this._category = category;
        this.refresh();
        this.resetScroll();
    }
};

// カテゴリーを選択する
Window_ItemList.prototype.cursorRight = function(wrap) {
    var index = this._cgIndex;
    var maxIndex = Object.keys(this._categories).length-1;
    if (index < maxIndex) {
        SoundManager.playCursor();
        this.setCategory(this._categories[++this._cgIndex]);
        this.select(0);
    }
};

Window_ItemList.prototype.cursorLeft = function(wrap) {
    var index = this._cgIndex;
    var minIndex = 0;
    if (index > minIndex) {
        SoundManager.playCursor();
        this.setCategory(this._categories[--this._cgIndex]);
        this.select(0);
    }
};

Window_ItemList.prototype.standardBackOpacity = function() {
    this.backFrameOpacity = 0;
    return 0;
};

Window_ItemList.prototype.drawItem = function(index) {
    var item = this._data[index];
    if (item) {
        var numberWidth = this.numberWidth();
        var rect = this.itemRect(index);
        rect.width -= this.textPadding();
        this.changePaintOpacity(this.isEnabled(item));
        this.drawItemName(item, rect.x, rect.y, rect.width - numberWidth);
        if(!item.meta.Back){
            if(this._category == 'weapon'){
                if($gameActors._data[1]._equips[0].object() && $gameActors._data[1]._equips[0].object() == item){
                    this.drawItemEquip(item, rect.x, rect.y, rect.width);
                }
            }else{
                this.drawItemNumber(item, rect.x, rect.y, rect.width);
            }
        }
        this.changePaintOpacity(1);
    }
};

Window_ItemList.prototype.drawItemEquip = function(item, x, y, width) {
    this.drawText('[装備中]', x, y, width, 'right');   
};

Window_ItemList.prototype.isEnabled = function(item) {
    return true;
};

Window_ItemList.prototype.drawItemName = function(item, x, y, width) {
    width = width || 312;
    if (item) {
        this.resetTextColor();
        this.contents.fontSize = 21;
        this.drawText(item.name, x + 10, y, width -10);
    }
};

Window_ItemList.prototype.processOk = function() {
    if(DataManager.isItem(this.item())  && this.item().itypeId === 2 && !this.item().meta.Back) {
        this.playBuzzerSound();
    }else{
        this.playOkSound();
        this.updateInputData();
        if(this._category != 'weapon'){
            this.deactivate();
        }
        this.callOkHandler();
        if(this._category == 'weapon'){
            this.refresh();
        }
    }
};



//装備アイテムの消失を回避するため、かなの処理をなくす
Game_Actor.prototype.tradeItemWithParty = function(newItem, oldItem) {
    if (newItem && !$gameParty.hasItem(newItem)) {
        return false;
    } else {
        // $gameParty.gainItem(oldItem, 1);
        // $gameParty.loseItem(newItem, 1);
        return true;
    }
};

//=============================================================================
// Window_MemoList クラス追加
//=============================================================================

function Window_MemoList() {
    this.initialize.apply(this, arguments);
}

Window_MemoList.prototype = Object.create(Window_Selectable.prototype);
Window_MemoList.prototype.constructor = Window_MemoList;

Window_MemoList.prototype.initialize = function(x, y, width, height) {
    Window_Selectable.prototype.initialize.call(this, x, y, width, height);
    this._category = 'none';
    this._data = [];
};

Window_MemoList.prototype.setCategory = function(category) {
    if (this._category !== category) {
        this._category = category;
        this.refresh();
        this.resetScroll();
    }
};

Window_MemoList.prototype.maxCols = function() {
    return 1;
};

Window_MemoList.prototype.spacing = function() {
    return 48;
};

Window_MemoList.prototype.maxItems = function() {
    return this._data ? this._data.length : 1;
};

Window_MemoList.prototype.item = function() {
    var index = this.index();
    return this._data && index >= 0 ? this._data[index] : null;
};

Window_MemoList.prototype.isCurrentItemEnabled = function() {
    return this.isEnabled(this.item());
};

Window_MemoList.prototype.includes = function(item) {
    switch (this._category) {
    case 'memo':
        return DataManager.isItem(item) && item.meta.Memo;
    default:
        return false;
    }
};

Window_MemoList.prototype.needsNumber = function() {
    return true;
};

Window_MemoList.prototype.isEnabled = function(item) {
    return $gameParty.canUse(item);
};

Window_MemoList.prototype.makeItemList = function() {
    this._data = $gameParty.allItems().filter(function(item) {
        return this.includes(item);
    }, this);
    if (this.includes(null)) {
        this._data.push(null);
    }
};

Window_MemoList.prototype.selectLast = function() {
    var index = this._data.indexOf($gameParty.lastItem());
    this.select(index >= 0 ? index : 0);
};

Window_MemoList.prototype.drawItem = function(index) {
    var item = this._data[index];
    if (item) {
        var numberWidth = this.numberWidth();
        var rect = this.itemRect(index);
        rect.width -= this.textPadding();
        this.changePaintOpacity(this.isEnabled(item));
        this.drawItemName(item, rect.x, rect.y, rect.width - numberWidth);
        this.changePaintOpacity(1);
    }
};

Window_MemoList.prototype.numberWidth = function() {
    return this.textWidth('000');
};

Window_MemoList.prototype.drawItemName = function(item, x, y, width) {
    width = width || 312;
    if (item) {
        this.resetTextColor();
        this.contents.fontSize = 21;
        this.drawText(item.name, x + 10, y, width -10);
    }
};

Window_MemoList.prototype.updateHelp = function() {
    this.setHelpWindowItem(this.item());
};

Window_MemoList.prototype.processOk = function() {
    if (this.item().meta.Back) {
        this.playOkSound();
        this.updateInputData();
        this.deactivate();
        this.callOkHandler();
    } else {
        this.playBuzzerSound();
    }
};

Window_MemoList.prototype.refresh = function() {
    this.makeItemList();
    this.createContents();
    this.drawAllItems();
};

Window_MemoList.prototype.standardBackOpacity = function() {
    //return 192;
    this.backFrameOpacity = 0;
    return 0;
};

//=============================================================================
// Window_ActList クラス追加
//=============================================================================

function Window_ActList() {
    this.initialize.apply(this, arguments);
}

Window_ActList.prototype = Object.create(Window_Selectable.prototype);
Window_ActList.prototype.constructor = Window_ActList;

Window_ActList.prototype.initialize = function(x, y, width, height) {
    Window_Selectable.prototype.initialize.call(this, x, y, width, height);
    this._category = 'none';
    this._data = [];
};

Window_ActList.prototype.setCategory = function(category) {
    if (this._category !== category) {
        this._category = category;
        this.refresh();
        this.resetScroll();
    }
};

Window_ActList.prototype.maxCols = function() {
    return 3;
};

Window_ActList.prototype.spacing = function() {
    return 15;
};

Window_ActList.prototype.maxItems = function() {
    return this._data ? this._data.length : 1;
};

Window_ActList.prototype.item = function() {
    var index = this.index();
    return this._data && index >= 0 ? this._data[index] : null;
};

Window_ActList.prototype.isCurrentItemEnabled = function() {
    return this.isEnabled(this.item());
};

Window_ActList.prototype.includes = function(item) {
        return DataManager.isItem(item) && item.itypeId == 3;
};

Window_ActList.prototype.needsNumber = function() {
    return true;
};

Window_ActList.prototype.isEnabled = function(item) {
    return $gameParty.canUse(item);
};

Window_ActList.prototype.makeItemList = function() {
    this._data = $gameParty.allItems().filter(function(item) {
        return this.includes(item);
    }, this);
    if (this.includes(null)) {
        this._data.push(null);
    }
};

Window_ActList.prototype.selectLast = function() {
    var index = this._data.indexOf($gameParty.lastItem());
    this.select(index >= 0 ? index : 0);
};

Window_ActList.prototype.drawItem = function(index) {
    var item = this._data[index];
    if (item) {
        var rect = this.itemRectForText(index);
        //var align = this.itemTextAlign();
        this.resetTextColor();
        this.changePaintOpacity(this.isEnabled(item));
        this.drawIcon(item, rect.x-1,rect.y+2);
    }
};

Window_ActList.prototype.drawIcon = function(item, x, y) {
    var actNm = item.meta.ActNm;
    console.log(actNm);
    var bitmap = ImageManager.loadPicture(actNm);
    this.contents.blt(bitmap, 0, 0, 72, 78, x, y );
}; 

Window_ActList.prototype.numberWidth = function() {
    return this.textWidth('000');
};

Window_ActList.prototype.updateHelp = function() {
    this.setHelpWindowItem(this.item());
};

Window_ActList.prototype.processOk = function() {
    var moveSpeed = 4;
    if(this.item().meta.ActId == ($gameSystem._curActId ? $gameSystem._curActId : 0)){
        $gameSystem._curActId = 13;
    }else{
        //ActIdはコモンイベントのIDを設定する。（絶対設定しないとエラーになる）
        $gameSystem._curActId = this.item().meta.ActId;
        //移動速度を設定したい場合、「MoveSpeed」を設定することで移動速度を変更できる
        if(this.item().meta.MoveSpeed){
            moveSpeed = Number(this.item().meta.MoveSpeed);
        }
    }
    $gamePlayer.setMoveSpeed(moveSpeed);
    $gameTemp._commonEventId = $gameSystem._curActId;
    this.playOkSound();
    this.updateInputData();
    this.deactivate();
    this.callOkHandler();
};

Window_ActList.prototype.refresh = function() {
    this.makeItemList();
    this.createContents();
    this.drawAllItems();
};


Window_ActList.prototype.textPadding = function() {
    return 1;
};

Window_ActList.prototype.lineHeight = function() {
    return 82;
};

Window_ActList.prototype.standardPadding = function() {
    return 1;
};

Window_ActList.prototype.fittingHeight = function(numLines) {
    return numLines * this.lineHeight() + (numLines - 1) * 10 + this.standardPadding() * 2;
};


Window_ActList.prototype.standardBackOpacity = function() {
    this.backFrameOpacity = 0;
    return 0;
};
//=============================================================================
// DataManager メソッド拡張
//=============================================================================
DataManager.makeSavefileInfo = function() {
    var info = {};
    info.globalId   = this._globalId;
    info.title      = $dataSystem.gameTitle;
    info.characters = $gameParty.charactersForSavefile();
    info.faces      = $gameParty.facesForSavefile();
    info.playtime   = $gameSystem.playtimeText();
    //変更点6
    info.location    = $dataMap.displayName != "" ? $dataMap.displayName : $dataMapInfos[$gameMap.mapId()].name;
    info.timestamp  = Date.now();
    return info;
};