const StateMachines = require("statemachines")

const ALPH = ["a","b","c","d","e","f","g","h","i","j","k","l","m","n","o","p","q","r","s","t","u","v","w","x","y","z"];

let wordToBoolVector = (x, w) => {
	return w.split("").map((c) => c === x)
}

let wholeWordProfile = (w) => {
	let curNum = 0;
	let res = []
	let seen = {}
	w.split("").forEach((c)=>{
		if(!seen[c]){
			curNum++;
			seen[c] = curNum
		}
		res.push(seen[c])
	})
	return res
}

let intToState = (i, w) => {
	return {
		cons :  i % (w.length + 1),
		dist :  Math.floor(i / (w.length + 1))
	}	
}

let stateToInt = (q, w) => {
	return (w.length + 1) * q.dist + q.cons
}

function levenshtein(w, n){
	w = w.toLowerCase()
	let table = []
	let accepts = []
	// insert n * (w.len + 1) states
	for (let i = 0; i < n * (w.length + 1); i++){
		let state = intToState(i, w)
		let transitions = {}
	
		/*
		Shulz and Mihov note that while other states could be used as accepts,
		they're all subsumed by these states in the sense that the same surface form
		could have been arrived at by some other accepting edit history
		*/
		if (state.cons == w.length) accepts.push(i) 		
		if (state.cons < w.length && state.dist < n - 1){
			// star transitions 
			// I have uniliterally decided that for this use case we will lowercase everything because 
			// there is no way in hell that historical capitalization would have been standardized enough to be useful
			ALPH.forEach((c)=>{
				transitions[c] = [
					stateToInt({
						cons : state.cons + 1,
						dist : state.dist + 1
					}, w)
				]
			})
			// empty transitions
			transitions[""] = [
				stateToInt({
					cons : state.cons + 1,
					dist : state.dist + 1
				}, w)
			]
		}


		// plain letter transitions
		if (state.cons < w.length){
			transitions[w.charAt(state.cons)] = [
				stateToInt({
					dist : state.dist,
					cons : state.cons + 1
				}, w)
			]
		}

		// 
		if (state.dist < n - 1){
			ALPH.forEach((c)=>{
				if (transitions[c]){
					transitions[c].push([
						stateToInt({
							cons : state.cons,
							dist : state.dist + 1
						}, w)
					])
				}else{
					transitions[c] = [
						stateToInt({
							cons : state.cons,
							dist : state.dist + 1
						}, w)
					]
				}
			})
		}

		table.push(transitions)
	}


	return new StateMachines.Nondeterministic(table, accepts).subset()
}

console.log(wholeWordProfile("aachen"))

let machine = levenshtein("Benjamin Franklin", 4)
console.log(machine.test("Fenjamin Branklinz".toLowerCase()))