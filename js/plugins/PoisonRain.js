
//=============================================================================
// PoisonRain.js
//=============================================================================

/*:
 * @plugindesc add new weather type "poison rain".
 * @author ryiwamoto
 *
 * @help This plugin does not provide plugin commands.
 */

/*:ja
 * @plugindesc 新しい天候「毒の雨」を追加します.
 * @author ryiwamoto
 *
 * @help このプラグインには、プラグインコマンドはありません。
 */

(function () {
    Weather.WEATER_TYPE_POISON_RAIN = 'poison_rain';

    var originalWheatherCreateBitmaps = Weather.prototype._createBitmaps;
    Weather.prototype._createBitmaps = function () {
        this._poisonRainBitmap = new Bitmap(1, 60);
        this._poisonRainBitmap.fillAll('purple');
        originalWheatherCreateBitmaps.apply(this, arguments);
    };

    var originalUpdateSprite = Weather.prototype._updateSprite;
    Weather.prototype._updateSprite = function (sprite) {
        if (this.type === Weather.WEATER_TYPE_POISON_RAIN) {
            this._updatePoisonRainSprite(sprite);
        }
        originalUpdateSprite.apply(this, arguments);
    };

    Weather.prototype._updatePoisonRainSprite = function (sprite) {
        sprite.bitmap = this._poisonRainBitmap;
        sprite.rotation = Math.PI / 16;
        sprite.ax -= 6 * Math.sin(sprite.rotation);
        sprite.ay += 6 * Math.cos(sprite.rotation);
        sprite.opacity -= 6;
    };

    var originalUpdateAllSprites = Weather.prototype._updateAllSprites;
    Weather.prototype._updateAllSprites = function () {
        if (this.type === Weather.WEATER_TYPE_POISON_RAIN && Graphics.frameCount % 60 === 0) {
            $gameParty.members().forEach(function (actor) {
                actor.executeFloorDamage();
            });
        }
        originalUpdateAllSprites.apply(this, arguments);
    };
})();