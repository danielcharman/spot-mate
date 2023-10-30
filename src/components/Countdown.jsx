import { useState, useEffect } from 'react'

function Countdown({initialDate, onComplete}) {
	let secondsRemaining = (
		Date.parse(new Date(initialDate)) -
		Date.parse(new Date()) 
	) / 1000;	
	
    const [timeRemaining, setTimeRemaining] = useState(secondsRemaining) 

	useEffect(() => {
		const interval = setInterval(() => {
			secondsRemaining = (
				Date.parse(new Date(initialDate)) -
				Date.parse(new Date()) 
			) / 1000;	

			if(secondsRemaining <= 0) {
				onComplete()
				clearInterval(interval)
				setTimeRemaining(0);
				return
			}else{
				setTimeRemaining(secondsRemaining);
			}
		}, 1000);
	
		return () => clearInterval(interval);
	}, [timeRemaining]);

	const secondsToRemaining = (seconds) => {
		
		//days 
		let days = Math.floor(seconds/(24*3600)); 
		seconds -= days*24*3600; 
		
		//hours 
		let hours = Math.floor(seconds/3600); 
		seconds -= hours*3600; 
		
		//minutes 
		let minutes = Math.floor(seconds/60); 
		seconds -= minutes*60; 
		
		//output 
		return(
			`${days > 9 ? days : '0' + days}:${hours > 9 ? hours : '0' + hours}:${minutes > 9 ? minutes : '0' + minutes}:${seconds > 9 ? seconds : '0' + seconds}`
		); 
	}

	if(timeRemaining > 0) {
		return (
			<small>
				Time remaining: {secondsToRemaining(timeRemaining)}
			</small>
		)
	}

	return (
		<small>
			Finished
		</small>
	)
  }
  
  export default Countdown