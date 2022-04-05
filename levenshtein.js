const StateMachines = require("statemachines")

const ALPH = ["a","b","c","d","e","f","g","h","i","j","k","l","m","n","o","p","q","r","s","t","u","v","w","x","y","z"];

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
	let table = []
	let accepts = []
	// insert n * (w.len + 1) states
	for (let i = 0; i < n * (w.length + 1); i++){
		let state = intToState(i, w)
		let transitions = {}
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

let machine = levenshtein("food", 3)
console.log(machine)
console.log(machine.test("food"))
console.log(machine.test("fxod"))
console.log(machine.test("fxood"))
console.log(machine.test("fxd"))
console.log(machine.test("monkeydoodle"))
