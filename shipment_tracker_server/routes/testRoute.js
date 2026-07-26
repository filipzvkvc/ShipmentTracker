const express = require('express');
const testController = require('../controllers/testController');

const { IS_STAGING, IS_FAKE_ENV, IS_PRODUCTION ,IS_DEVELOPMENT, IS_TEST } = require('../config/environment');
const allowedLocalNetworkMiddleware = require('../middlewares/allowedLocalNetworkMiddleware');
const { tokenValidationMiddleware } = require('../middlewares/tokenValidationMiddleware');

const router = express.Router();

router.route('/getip')
	.get( testController.getIpAddress );

if( (IS_STAGING || IS_PRODUCTION) && IS_FAKE_ENV || IS_DEVELOPMENT || IS_TEST){  
	router.route('/testroute')
					.get( testController.testRoute )
  router.route('/testip')
					.get( allowedLocalNetworkMiddleware, testController.allowedLocalNetwork);

	router.route('/validatetoken')	
					.post( tokenValidationMiddleware, testController.tokenValidated )        
}





module.exports = router;
