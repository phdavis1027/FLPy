


class grammar:
	def __init__(self,p,t,v,s):
		self.p = p
		self.t=t
		self.v=v
		self.s=s

	def cyk(self, s):
		tabl = dict()
		l = len(s)
		for length in range(1,l+1): #get substrings in ascending order of length 
			if length == 1: #strings of length 1, directly inspect the grammar
				for i in range(l):
					index = (i,i)
					vn = set()
					for key in self.p.keys():
						if s[i] in self.p[key]:
							vn.add(key)
					tabl[index] = vn			
			elif length == 2: #strings of length 2
				for i in range(l):
					try:
						B = s[i]
						C = s[i+1]
						index = (i, i+1)

						vn = set()
						for key in self.p.keys(): #look for the non-terminals that 
							if B in self.p[key]:
								B = key
							if C in self.p[key]:
								C = key
						if B in self.v and C in self.v:
							target = B + C

							for key in self.p.keys(): #inspect the grammar again
								if target in self.p[key]: 
									vn.add(key)
							tabl[index] = vn
					except IndexError: #end of string, we're all good
						pass
			else: #for strings longer than 2, we'll have to figure out where to look
				for i in range(l): 
					if i + length <= l: #generate every possible substring of greater length	
						sub_string = s[i:i+length]
						sub_length = len(sub_string)
						for div in range(1, sub_length):	#consider every possible bipartite cut of that substring
							B = sub_string[:div]
							C = sub_string[div:]		
							print(B + "||" + C)
						#figure out which indices to consult
def main():
	p = {'S':{'AB'}, 'A':{'BB','a'},'B':{'AB','b'}}
	v = {'S','A','B'}	
	t = {'a','b'}
	s = 'S'
	g = grammar(p,t,v,s)

	surface = "aabbb"
	g.cyk(surface)



if __name__ == "__main__":
    main()
