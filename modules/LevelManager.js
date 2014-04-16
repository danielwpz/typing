/**
 * This is a module that controls all levels.
 *
 * When a user wants to practise typing or 
 * wants to challenge some body else, a level
 * should be associated with him judging by 
 * his history records. So the difficulty of
 * typing content shall be equal to his ability.
 */
var fs = require('fs');

function LevelManager(option, callback) {
	/* Parse the option to determine level */

	fs.readFile(option.levelPath + 'level0.lv', 'utf-8', callback);
}

module.exports = LevelManager;
