/**
 * @fileoverview Ensure that no empty blocks {} exist
 * @author Raghav Dua <duaraghav8@gmail.com>
 */

'use strict';

module.exports = {

	verify: function (context) {

		function report (node, loc) {
			context.report ({
				node: node,
				message: 'Use of empty block statement {}',
				location: loc
			});
		}

		var similarNodeTypes = ['ContractStatement', 'LibraryStatement'];

		similarNodeTypes.forEach (function (event) {
			context.on (event, function (emitted) {
				var node = emitted.node,
					sourceCode = context.getSourceCode (),
					text = sourceCode.getText (node);

				if (emitted.exit) {
					return;
				}

				if (node.body === null) {
					report (node, { column: text.indexOf ('{') });
				}
			});
		});

		context.on ('BlockStatement', function (emitted) {
			var node = emitted.node;

			if (emitted.exit) {
				return;
			}

			if (node.body && node.body.constructor.name === 'Array' && !node.body.length) {
				report (node);
			}
		});

	}

};