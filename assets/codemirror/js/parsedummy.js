var DummyParser = Editor.Parser = ((() => {
  function tokenizeDummy(source) {
    while (!source.endOfLine()) source.next();
    return "text";
  }
  function parseDummy(source) {
    function indentTo(n) {return () => n;}
    source = tokenizer(source, tokenizeDummy);
    var space = 0;

    var iter = {
      next() {
        var tok = source.next();
        if (tok.type == "whitespace") {
          if (tok.value == "\n") tok.indentation = indentTo(space);
          else space = tok.value.length;
        }
        return tok;
      },
      copy() {
        var _space = space;
        return _source => {
          space = _space;
          source = tokenizer(_source, tokenizeDummy);
          return iter;
        };
      }
    };
    return iter;
  }
  return {make: parseDummy};
}))();
