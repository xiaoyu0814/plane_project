import api from '@/api/index.js';
export function getUserMsg(user,password){
	return new Promise(function(resolve, reject) {
		api.post('login/auth',null,
			{username:user,password:password},
			successRes => { 
			   //console.log(successRes)
				resolve(successRes);
			},
			failureRes =>{                        
				//console.log(failureRes)
				resolve(failureRes);
			}
		)
	})
}

