function Machin(definition){
    var definition  =   definition          ||  {};
    this.start      =   definition.start    ||  0;
    this.finals     =   definition.finals   ||  [];
    this.states     =   definition.states   ||  [];
    this.symbols    =   definition.symbols  ||  [];
    this.table      =   definition.table    ||  {};
}

Machin.prototype.change  =   function(definition){
    var definition  =   definition          ||  {};
    this.start      =   definition.start    ||  0;
    this.finals     =   definition.finals   ||  [];
    this.states     =   definition.states   ||  [];
    this.symbols    =   definition.symbols  ||  [];
    this.table      =   definition.table    ||  {};    
}

/**
 * Set start state of NFA
 * @param {type} start
 * @returns {undefined}
 */
Machin.prototype.setStart   =   function(start){
    this.start  =   start;
}

/**
 * Set names of states
 * @param {type} states
 * @returns {undefined}
 */
Machin.prototype.setStates  =   function (states){
    this.states =   states;
}

/**
 * set final states
 * @param {Array} finals
 * @returns {undefined}
 */
Machin.prototype.setFinals  =   function(finals){
    this.finals =   finals;
}

/**
 * Set NFA table
 * @param {type} table
 * @returns {undefined}
 */
Machin.prototype.setTable   =   function(table){
    this.table  =   table;
}

/**
 * set NFA Symbols
 * @param {type} symbols
 * @returns {undefined}
 */
Machin.prototype.setSymbols =   function(symbols){
    this.symbols    =   symbols;
}

Machin.prototype.Move       =   function(T,x){
    var result  =   [],
        self    =   this;
    
    T.forEach(function(state){
        self.table[state][x].forEach(function(t){
            if (result.indexOf(t) < 0)
                result.push(t);
        });
    });
    return result;
}

Machin.prototype.LClosure       =   function(states){
    if (typeof states   === typeof  [])
        return this.LClosureT(states);
    return this.LClosureS(states);
}

Machin.prototype.LClosureS      =   function(state){
    var result  =   [];
    result.push(state);
    this.table[state]['Landa'].forEach(function(t){
        result.push(t);
    });
    return result;
}

Machin.prototype.LClosureT      =   function(states){
    var t,stack   =   [];
    states.forEach(function(t){
        stack.push(t);
    });
    while(stack.length > 0){
        t   =   stack.pop();
        this.table[t]['Landa'].forEach(function(u){
            if (states.indexOf(u) < 0){
                states.push(u);
                stack.push(u);
            }
        })
    }
    return states;
}

Machin.prototype.Convert    =   function(){
    var LS0         =   this.LClosure(this.start),
        stack       =   [],
        T,U         =   undefined,
        self        =   this;
    
    this.Dstates    =   {};
    this.Dstates[JSON.stringify(LS0)] = {};
    stack.push(LS0);
    
    while(stack.length > 0){
        T   =   stack.pop();
        this.symbols.forEach(function(symbol){
            if (symbol != "Landa"){
                U   =   self.LClosure(self.Move(T,symbol));
                if (self.Dstates[JSON.stringify(U)] === undefined){
                    stack.push(U);
                    self.Dstates[JSON.stringify(U)] =   {};
                }
                self.Dstates[JSON.stringify(T)][symbol] =   JSON.stringify(U);                
            }
        });
    }
}

Machin.prototype.getDFA     =   function(){
    if (!this.Dstates)
        this.Convert();
    return this.Dstates;
}