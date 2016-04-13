/**
 * Created by sanji on 2/18/2016.
 */
var mongoose = require('mongoose');
/*mongoose.connect('mongodb://localhost:27017/mongooseDB');*/
var Schema = mongoose.Schema;
var surveyList = new Schema ({
    id: Number,
    username: String,
    name: String,
    questions: Object,
    editable: Boolean,
    participants: {type:Array, default:[]},
    response:{type:Array, default:[]}
});


var surveyListModel = mongoose.model('surveyListModel', surveyList, 'surveyListModel');



module.exports = surveyListModel;