//=============================================================================
// メッセージ効果音.js
//=============================================================================

/*:ja
 * v0.5.1
 * @plugindesc
 * メッセージ中にSEを演奏する
 *
 * @author Declare War
 *
 * @param SeData1
 * @default Open1
 * @desc 演奏するSEのファイル名
 *
 * @param SeData2
 * @default 60
 * @desc 演奏するSEのボリューム
 *
 * @param SeData3
 * @default 100
 * @desc 演奏するSEのピッチ
 *
 * @param SeData4
 * @default 0
 * @desc 演奏するSEのパン
 *
 * @param SeWait
 * @default 2
 * @desc SEの演奏する間隔
 *
 * @param StopSeSw
 * @default 1
 * @desc SEの演奏をやめるスイッチ
 *
 * @help ■概要
 * MessageSEプラグインを利用するにはプラグインコマンドから実行します。
 * プラグインコマンドを実行すると会話中のSE効果を変更することが可能です。
 *
 * ■プラグインコマンド
 *   EncounterControl set [SE名] [音量] [ピッチ] [パン] [演奏間隔] [停止スイッチ]　　# SEを設定します
 *   EncounterControl clear                                                   # 初期設定状態に戻します
 */

/*:en
 * @plugindesc
 * messageSe
 *
 * @author Declare War
 *
 * @param SeData1
 * @default Open1
 * @desc Play Se name
 *
 * @param SeData2
 * @default 60
 * @desc Play Se volume
 *
 * @param SeData3
 * @default 100
 * @desc Play Se pitch
 *
 * @param SeData4
 * @default 0
 * @desc Play Se pan
 *
 * @param SeWait
 * @default 2
 * @desc Duration play Se
 *
 * @param StopSeSw
 * @default 1
 * @desc stop se switch number
 *
 * @help ■概要
 * MessageSEプラグインを利用するにはプラグインコマンドから実行します。
 * プラグインコマンドを実行すると会話中のSE効果を変更することが可能です。
 *
 * ■プラグインコマンド
 *   EncounterControl set [SE名] [音量] [ピッチ] [パン] [演奏間隔] [停止スイッチ]　　# SEを設定します
 *   EncounterControl clear                                                   # 初期設定状態に戻します
 */

//name space
var msgse = msgse || (msgse = {});

(function(msgse){
	var MessageSe = (function(){
                     //constructor
                     function MessageSe(){
                     this.seName = '';
                     this.volume = 40;
                     this.pitch = 100;
                     this.lr = 0;
                     this.seWait = 2;
                     this.stopSeSw = 1;
                     
                     this._tr = null;
                     
                     this.initialize();
                     };
                     
                     //member methods
                     MessageSe.prototype.initialize = function(){
                     var parameters = PluginManager.parameters('MessageSE');
                     this.seName = parameters['SeData1'] || '';
                     this.volume = Number(parameters['SeData2'] || 0);
                     this.pitch = Number(parameters['SeData3'] || 0);
                     this.lr = Number(parameters['SeData4'] || 0);
                     this.seWait = Number(parameters['SeWait'] || 2);
                     this.stopSeSw = Number(parameters['StopSeSw'] || 1);
                     };
                     
                     MessageSe.prototype.setParameter = function(args){
                     //parse
                     if(args.length < 6){
                     this._tr("setParameter: args is invalid.");
                     return false;
                     }
                     
                     var parameters = PluginManager.parameters('MessageSE');
                     this.seName = args[1]
                     this.volume = Number(args[2]);
                     this.pitch = Number(args[3]);
                     this.lr = Number(args[4]);
                     this.seWait = Number(args[5]);
                     this.stopSeSw = Number(args[7]);
                     return true;
                     };
                     
                     return MessageSe;
                     }
                     )();
 
 MessageSe.prototype.clearParameter = function(){
 var parameters = PluginManager.parameters('MessageSE');
 this.seName = parameters['SeData1'] || '';
 this.volume = Number(parameters['SeData2'] || 0);
 this.pitch = Number(parameters['SeData3'] || 0);
 this.lr = Number(parameters['SeData4'] || 0);
 this.seWait = Number(parameters['SeWait'] || 2);
 this.stopSeSw = Number(parameters['StopSeSw'] || 1);
 };
 msgse.MessageSe = new MessageSe();
 }(msgse || (msgse = { }) ));


(function(){
 //-----------------------------------------------------------------------------
 // parse and dispatch plugin command
 //-----------------------------------------------------------------------------
 var _Game_Interpreter_pluginCommand =
 Game_Interpreter.prototype.pluginCommand;
 Game_Interpreter.prototype.pluginCommand = function(command, args){
 _Game_Interpreter_pluginCommand.call(this, command, args);
 if(command === 'MessageSE'){
 switch(args[0]){
 case 'set':
 msgse.MessageSe.setParameter(args);
 break;
 case 'clear':
 msgse.MessageSe.clearParameter();
 break;
 default:
 break;
 }
 }
 };
 
	// Window_Message  ---------------------------------------------------
	// clearFlags #a
	var _Window_Message_clearFlags = Window_Message.prototype.clearFlags
	Window_Message.prototype.clearFlags = function(){
 _Window_Message_clearFlags.call(this);
 this._seCount = 0;
	};
	// processCharacter #a
	var _Window_Message_processCharacter = Window_Message.prototype.processCharacter
	Window_Message.prototype.processCharacter = function(textState){
 _Window_Message_processCharacter.call(this, this._textState)
 this.messageSePlay();
	};
	// messageSePlay #n
	Window_Message.prototype.messageSePlay = function(){
        var MessageSeObj = new Object();
        MessageSeObj.name = msgse.MessageSe.seName;
        MessageSeObj.volume = Number( msgse.MessageSe.volume);
        MessageSeObj.pitch = msgse.MessageSe.pitch;
        MessageSeObj.pan = msgse.MessageSe.lr;
 if (this.sePlayOk(msgse.MessageSe)){
    AudioManager.playSe(MessageSeObj);
 }
 this._seCount++;
	};
	// sePlayOk #n
	Window_Message.prototype.sePlayOk = function(Params){
 if (this._seCount % Params.seWait == 0){
 if(!this._showFast){
 if (!$gameSwitches.value(Params.stopSeSw)){
 return true;
 }
 }
 }
 return false;
	};
 })();