// CJBLP (Cycro's JavaScript based languages pack)
"use strict";
const StyleScript=Object.freeze({
    lexer: function (code) {
      let codesplit=code.split("");
      let code2=codesplit.filter(function(token) {return token.length > 0});
      let result=[];
      let v1="";
      for (let i=0;i<code2.length;i++){
        v1=code2[i];
        if (/^[a-zA-z]/.test(code2[i])){
          while(!/^.+\s/.test(v1)){
            i++;
            if(/^.+;/.test(v1)){
              i--;
              break;
            }
            if (code2[i]===undefined){
              v1+=" "
              break;
            } else{
              v1+=code2[i]
            }
            if(!/[a-zA-Z]/.test(v1[v1.length-1])){
              i--;
              break;
            }
          }
          result.push({type:"word", value:v1.slice(0,-1)});
          if(/^.+;/.test(v1)){
            result.push({type:"semicolon", value:";"});
          }
          if(!/[a-zA-Z]/.test(v1)){}
        } else if (/;/.test(code2[i])){
          result.push({type:"semicolon", value:";"});
        }
        else if (/\s/.test(code2[i])){
  
        }
        else if (/^\!/.test(code2[i])){
          while(!/^\!.*\!/.test(v1)){
            i++;
            if (code2[i]===undefined){
              throw {stage:"lexer",error:"SyntaxError",body:"Unterminated selector literal"}
            }
            v1+=code2[i]
          }
          result.push({type:"selector", value:v1});
        }
        else if (/;/.test(code2[i])){
          result.push({type:"semicolon", value:";"});
        }
        else if (/^\{/.test(code2[i])){
          while(!/^\{.*\}/.test(v1)){
            i++;
            if (code2[i]===undefined){
              throw {stage:"lexer",error:"SyntaxError",body:"Unterminated properties literal"}
            }
            v1+=code2[i]
          }
          result.push({type:"properties", value:v1});
        }
        else if (/^["']/.test(code2[i])){
          while(!/^["'].*["']/.test(v1)){
            i++;
            if (code2[i]===undefined){
              throw {stage:"lexer",error:"SyntaxError",body:"Unterminated string literal"}
            }
            v1+=code2[i]
          }
          result.push({type:"string", value:v1});
        }
        else if (/^[0-9]/.test(code2[i])){
          while(!/^[0-9.]+(\?|cm|mm|in|px|pt|pc|em|ex|ch|rem|vw|vh|vmin|vmax|%|s)/.test(v1)){
            i++;
            if (code2[i]===undefined){
              throw {stage:"lexer",error:"SyntaxError",body:"Invalid number literal"}
            }
            v1+=code2[i]
          }
          if ((v1.split(/\./)).length>2){throw {stage:"lexer",error:"SyntaxError",body:"Invalid number literal"}}
          result.push({type:"number", value:v1});
        }
  
        else {throw {stage:"lexer",error:"SyntaxError",body:"Invalid character: '"+code2[i]+"'"}}
      } 
      return result
  
    },
    parser: function (tokens){
      let AST={
          type: "StyleScript",
          body: [],
      }; // Abstract Syntax Tree
      let current_token, expression, argument;
      let v1;
      let other, v2;
      
      // Extract a token out of tokens and assign it to current_token until tokens is empty
      while (tokens.length > 0){
        current_token = tokens.shift();
        if(current_token.type === "word") {
          switch (current_token.value) {
              case "select":
                if(tokens.length>=3){
                  expression = {
                    type: "KeywordExpression",
                    name: 'select',
                    arguments: [],
                    block: [],
                  }
                  argument = tokens.shift();
                  if(argument.type === 'selector') {
                    expression.arguments.push({// add argument information to expression object
                    type: 'SelectorLiteral',
                    value: argument.value
                  })
                  } else if(argument.type === 'word') {
                    expression.arguments.push({
                      type: "Variable",
                      name: argument.value,
                    })
                  }else {
                    throw {stage:"parser",type:"SyntaxError",body:"Expected selector literal"};
                  }
                  argument = tokens.shift();
                  if(argument.type === 'properties') {
                    expression.arguments.push({// add argument information to expression object
                    type: 'PropertiesLiteral',
                    value: argument.value
                  })
                  }  else if(argument.type === 'word') {
                    expression.arguments.push({
                      type: "Variable",
                      name: argument.value,
                    })
                  }else {
                  throw {stage:"parser",type:"SyntaxError",body:"Expected properties literal"};
                  } 
                  argument = tokens.shift();
                  if(argument.type !== 'semicolon') {
                    throw {stage:"parser",type:"SyntaxError",body:"Expected semicolon"};
                  }
                  AST.body.push(expression)// push the expression object to body of our AST
                } else {
                  throw {stage:"parser",type:"SyntaxError",body:"Expected 2 arguments then a semicolon after select keyword"};
                }
                break;
              case "assign":
                  if(tokens.length>=3){
                    expression = {
                      type: "KeywordExpression",
                      name: 'assign',
                      arguments: [],
                      block: [],
                    }
                    argument = tokens.shift();
                    if(argument.type === 'word') {
                      expression.arguments.push({
                        type: "Variable",
                        name: argument.value,
                      })
                    }else {
                      throw {stage:"parser",type:"SyntaxError",body:"Expected variable name"};
                    }
                    argument = tokens.shift();
                      expression.arguments.push({
                        type: "Object",
                        name: argument.value,
                        type: argument.type,
                      })
                    argument = tokens.shift();
                    if(argument.type !== 'semicolon') {
                      throw {stage:"parser",type:"SyntaxError",body:"Expected semicolon"};
                    }
                    AST.body.push(expression)// push the expression object to body of our AST
                  } else {
                    throw {stage:"parser",type:"SyntaxError",body:"Expected 2 arguments then a semicolon after select keyword"};
                  }
                  break;
              default: 
                v1=current_token;
                AST.body.push({
                  type: "Variable",
                  name: argument.value,
                })
          }
        }
      }
  
      return AST; // Returns the AST
    },
    transformer: function(AST){
      let CSSAST=[];
      let memory={};
      let token;
      let v1;
      let v2;
      let v3;
      while (AST.body.length>0){
        token=AST.body.shift();
        switch(token.type){
          case "KeywordExpression":
            switch(token.name){
              case "select":
                v1={name:"value"}
                if(token.arguments[0].type=="SelectorLiteral"){
                  v2=token.arguments[0].value.slice(1,-1);
                } else{
                  if(memory[token.arguments[0].name]!=undefined){
                    if(memory[token.arguments[0].name].type=="selector"){
                      v2=memory[token.arguments[0].name].name.slice(1,-1);
                    } else {
                      throw {stage:"transformer",type:"TypeError",body:"Expected selector"};
                    }
                  } else {
                    throw {stage:"transformer",type:"ReferenceError",body:"Reference "+token.arguments[0].name+" is not defined"};
                  }
                  
                }
                if(token.arguments[1].type=="PropertiesLiteral"){
                  v3=token.arguments[1].value.slice(1,-1);
                } else{
                  if(memory[token.arguments[1].name]!=undefined){
                    if(memory[token.arguments[1].name].type=="properties"){
                      v3=memory[token.arguments[1].name].name.slice(1,-1);
                    } else {
                      throw {stage:"transformer",type:"TypeError",body:"Expected properties"};
                    }
                  } else {
                    throw {stage:"transformer",type:"ReferenceError",body:"Reference "+token.arguments[0].name+" is not defined"};
                  }
                  
                }
                v1=new Object();
                    v1[v2]=v3;
                  CSSAST.push(v1)
                break;
              case "assign":
                memory[token.arguments[0].name]=token.arguments[1];
                break;
            }
        }
      }
      return CSSAST;
    },
    generator: function(CSSAST){
      let CSSstr="";
      for (let i in CSSAST){
        try{
          document.querySelector(Object.keys(CSSAST[i])[0])
        } catch(ERR){
          throw {stage:"generator",type:"ValueError",body:"Invalid selector"}
        }
        CSSstr+=(`${Object.keys(CSSAST[i])} {${Object.values(CSSAST[i])}} `)
      }
      return CSSstr;
    },
    compile: function(script){
      return this.generator(this.transformer(this.parser(this.lexer(script))))
    },
    exec: function(script){
      const result = this.compile(script)
      const StyleScriptSheet=new CSSStyleSheet;
      StyleScriptSheet.replace(result);
      document.adoptedStyleSheets.push(StyleScriptSheet);
    },
    VERSION: "v0.0.1",
    toString: function(){return "StyleScript compiler, version "+this.VERSION},
    /*
    Datatypes: 
      Number (Can end with ? or a measurement): Currently useless
      Selector (!selector!): For selecting content
      Properties ({properties}): For defining CSS properties
    Keywords:
      select ?selector? ?properties?; : Selects elements specified by ?selector? 
        and gives them the properties ?properties?
      assign ?varname? ?newval?; : Sets the value of ?varname? to ?newval?
    */
})