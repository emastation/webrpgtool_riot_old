Meteor.methods({ // クライアントから呼ばれるサーバーコード。クライアントからアクセス可能にするためにlib以下のファイルに定義する。
  codeInsert: function (codeAttributes) {
    check(Meteor.userId(), String);
    check(codeAttributes, {
      name: String,
      typescript: String,
      javascript: String
    });

    var typescriptSimpleAPI = Meteor.npmRequire('typescript-simple');
    codeAttributes.javascript = typescriptSimpleAPI(codeAttributes.typescript);
    console.log(codeAttributes.javascript);

    var codeWithSameTitle = Codes.findOne({name: codeAttributes.name});
    if (codeWithSameTitle) {
      return {
        codeExists: true,
        _id: codeWithSameTitle._id
      }
    }

    var user = Meteor.user();
    var code = _.extend(codeAttributes, {
      userId: user._id,
      author: user.username,
      submitted: new Date()
    });

    var codeId = Codes.insert(code);

    return {
      _id: codeId
    };
  },
  codeUpdate: function (obj) {
    check(Meteor.userId(), String);
    check(obj, Object);
    check(obj.codeAttributes, {
      name: String,
      typescript: String,
      javascript: String,
      userId: String,
      author: String,
      submitted: Date
    });

    var typescriptSimpleAPI = Meteor.npmRequire('typescript-simple');
    obj.codeAttributes.javascript = typescriptSimpleAPI(obj.codeAttributes.typescript);

    Codes.update(obj.codeId, {$set: obj.codeAttributes}, function (error) {
      return error;
    });

    return {
      _id: obj.codeId
    };
  }
});
