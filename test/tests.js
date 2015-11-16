var µ = require("..");
var expect = require("chai").expect;

var original = {
  add: function (x, y) {
    return x + y;
  }
};

describe("Add behavior before a method with #before()", function () {

  it("Check arguments", function () {
    var modified = µ(original);
    modified.before("add", function (x, y) {
      expect(x).to.equal(1);
      expect(y).to.equal(2);
    });
    var result = modified.add(1, 2);
    expect(result).to.equal(3);
  });

  it("Modify arguments", function () {
    var modified = µ(original);
    modified.before("add", function (x, y) {
      return [ 2*x, 2*y ];
    });
    var doubled = modified.add(1, 2);
    expect(doubled).to.equal(6);
  });

});

describe("Add behavior after a method with #after()", function () {

  it("Check result", function () {
    var modified = µ(original);
    modified.after("add", function (result) {
      expect(result).to.equal(3);
    });
    modified.add(1, 2);
  });

  it("Modify result", function () {
    var modified = µ(original);
    modified.after("add", function (result) {
      return result+".00";
    });
    var formatted = modified.add(1, 2);
    expect(formatted).to.equal("3.00");
  });

});

describe("Replace a method with #insteadOf()", function () {

  it("Stub result", function () {
    var modified = µ(original);
    modified.insteadOf("add", function (result) {
      return 0;
    });
    var alwaysZero = modified.add(1, 2);
    expect(alwaysZero).to.equal(0);
  });

});

describe("Chain modifications for complex scenarios", function () {

  it("Check arguments and format result", function () {
    var modified = µ(original);
    modified
        .before("add", function (x, y) {
          expect(x%2).to.equal(0);
          expect(y%2).to.equal(0);
        })
        .after("add", function (result) {
          return result + " is even";
        });
    var mustBeEven = modified.add(2, 4);
    expect(mustBeEven).to.equal("6 is even");
  });

});

describe("#intercept()", function () {

  it("Verify caller name", function () {
    function main () {
      var modified = µ(original);
      modified.intercept("add", function interceptor (method) {
        expect(method.caller.name).to.equal("main");
      });
      modified.add(1, 2);
    }
    main();
  });

  it("Validate original method source code", function () {
    var modified = µ(original);
    modified.intercept("add", function interceptor (method, original) {
      var source = original.toString();
      expect(/x \+ y/.test(source)).to.equal(true);
    });
    modified.add(1, 2);
  });

  it("Kitchen sink", function kitchenSink () {
    var adder = {
      name: "MyAdder",
      add: function (x, y) {
        return x + y;
      }
    };
    var modified = µ(adder);
    modified.intercept("add", function interceptor (method, original, args, self) {
      expect(method.caller.name).to.equal("kitchenSink");
      expect(original.length).to.equal(2);
      expect(original.length).to.equal(args.length);
      expect(self.add).to.equal(original);
      expect(self.name).to.equal("MyAdder");
      expect(self.name).to.equal(modified.name);
    });
    modified.add(1, 2);
  });

});
