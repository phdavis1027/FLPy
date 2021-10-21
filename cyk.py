import itertools

class grammar:
	def __init__(self,p,t,v,s):
		self.p = p
		self.t=t
		self.v=v
		self.s=s

	def cyk(self, s):
		table = dict()
		l = len(s)
		for length in range(1,l+1): #get substrings in ascending order of length 
			if length == 1: #strings of length 1, directly inspect the grammar
				for i in range(l):
					index = (i,i)
					vn = set()
					for key in self.p.keys():
						if s[i] in self.p[key]:
							vn.add(key)
					table[index] = vn			
#			elif length == 2: #strings of length 2
#				for i in range(l):
#					try:
#						B = s[i]
#						C = s[i+1]
#						index = (i, i+1)
#						print(str(index))
#						print(B + C)
#
#						vn = set()
#						for key in self.p.keys(): #look for the non-terminals that 
#							if B in self.p[key]:
#								B = key
#
#							if C in self.p[key]:
#								C = key
#							target = B + C
#
#							for key in self.p.keys(): #inspect the grammar again
#								if target in self.p[key]: 
#									vn.add(key)
#							table[index] = vn
#					except IndexError: #end of string, we're all good
#						pass
			else: #for strings longer than 2, we'll have to figure out where to look
				for i in range(l): 
					if i + length <= l: #generate every possible substring of greater length	
						sub_string = s[i:i+length]
						index = (i,i+length-1)
						vn = set()
						sub_length = len(sub_string)
						for div in range(sub_length):	#consider every possible bipartite cut of that substring
							B = sub_string[:div]
							if len(B) == 0: #it's treating a front-loaded lambda
									#as a constituent, which I'll fix
									#before this is said and done,
									#but for now I just want this to
									#work
								continue
							C = sub_string[div:]		

							
							B_index = (i,i+div-1)
							C_index = (i+div, i+length-1)
							try:
								target_B = table[B_index]	
								target_C = table[C_index]
								targets_iter = itertools.product(target_B,target_C)
								targets = []
								for targ_tuple in targets_iter:
									targets.append(targ_tuple[0] + targ_tuple[1])
								for target in targets:
									for key in self.p.keys():
										if target in self.p[key]:
											vn.add(key)
							except KeyError: #happens when particular substring has no derivation in the grammar, not sure how to handle
								pass					
						table[index] = vn
		print(table)
		print(str((0,l-1)))
		return self.s in table[(0,l-1)]												
			
def main():
	p = {'S':{'AB'},'A':{'CD','CF'},'B':{'c','EB'},'C':{'a'},'D':{'b'},'E':{'c'},'F':{'AD'}}
	v = {'S','A','B','C','D','E','F'}	
	t = {'a','b','c'}
	s = 'S'
	g = grammar(p,t,v,s)

	surface = "abc"
	print(g.cyk(surface))



if __name__ == "__main__":
    main()
