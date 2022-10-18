# quick_base_temp_auth
A repository to show QuickBase developers how to use JavaScript to acquire and implement temporary authorization tokens in code pages.  

There seems to not be much awareness in the QB community on how to easily use Temp Auth tokens. 
The App token approach doesn't allow for child table access. 
The direct table DBID way ensues many fetch requests which can be long and confusing. 
This leaves developers relying on the older XML requests. 
I have been scratching my head about this and have come up with a solution I'd like to expose to the community. 

I have used JS ES6 async / await syntax which I find more readable than the Promise/.then code which comes out of the box from the QB API service. 

Please have a look and refine my code if you find a cleaner approach. 

Pre-requsites: 
- The developer must have a QB account.
- The developer must have an App Token. https://helpv2.quickbase.com/hc/en-us/articles/4570313549972-App-tokens 
