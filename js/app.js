var App = Ember.Application.create();

//Store
App.Store = DS.Store.extend({
	revision: 12,
	adapter: DS.FixtureAdapter.create()
});

// DS
App.Category = DS.Model.extend({
	name: DS.attr('string')
});

// Models
App.Contact = DS.Model.extend({
	name: DS.attr('string'),
	phone: DS.attr('string'),
	email: DS.attr('string'),
	
	abbr: function(){
		return this.get('name').charAt(0);
	}
});

// View Models
// used to present new or existing record that is being modified
// and needs to be disconnected from Ember model infrastructure
// to avoid two way binding 
App.contactViewModel = function(){
	this.id = null;
	this.name = '';
	this.phone = '';
	this.email = '';
};

// Routes
App.Router.map(
	function () {
		this.resource('contacts', function() {
			this.route('contact', {path: ':contact_id'});
			this.route('edit', {path: ':contact_id/edit'})
		})
	}
);

App.IndexRoute = Ember.Route.extend({
	redirect: function() {
		this.transitionTo('contacts');
	}
});

App.ContactsRoute = Ember.Route.extend({
	model: function() {
		return {
			categories: App.Category.find(),      
			contacts: App.Contact.find()
		}
	}
});

App.ContactsEditRoute = Ember.Route.extend({
	setupController: function(controller,model){
		var recordClone = new App.contactViewModel();

		recordClone.id = model.get('id');
		recordClone.name = model.get('name');
		recordClone.phone = model.get('phone');
		recordClone.email = model.get('email');

		controller.set('clone', recordClone); 
	}
});

// Controllers
App.SearchController = Ember.Controller.extend({
	searchStr: null,

	searchResults: function() {
		var searchTxt = this.get('searchStr');
		if(!searchTxt)
			return; 
		
		var reg = new RegExp(searchTxt, 'i');
		
		return App.Contact.filter(
			function(item, index, self) {
				return item.get('name').match(reg);
			}	
		);
	}.property('searchStr')
});

App.ContactAddController = Ember.Controller.extend({
	content: new App.contactViewModel(),
	
	nameIsValid: function(){
		return App.validateName(this.get('content').name)
	}.property('content.name'),

	phoneIsValid: function(){
		return App.validatePhone(this.get('content').phone)
	}.property('content.phone'),

	emailIsValid: function(){
		return App.validateEmail(this.get('content').email)
	}.property('content.email'),

	formInvalid: function(){
		return !App.validateContact(this.get('content'))
	}.property('content.name', 'content.phone', 'content.email'),

	add: function(model) {
		var contact = App.Contact.createRecord(model);
		contact.get('store').commit();
		this.set('content', new App.contactViewModel());
		this.transitionToRoute('contacts')
	}
});

App.ContactsEditController = Ember.Controller.extend({
	nameIsValid: function(){
		return App.validateName(this.get('clone').name)
	}.property('clone.name'),

	phoneIsValid: function(){
		return App.validatePhone(this.get('clone').phone)
	}.property('clone.phone'),

	emailIsValid: function(){
		return App.validateEmail(this.get('clone').email)
	}.property('clone.email'),

	formInvalid: function(){
		return !App.validateContact(this.get('clone'))
	}.property('clone.name', 'clone.phone', 'clone.email'),

	delete: function(){
		var current = this.get('clone');
		var record = App.Contact.find(current.id);
		
		record.deleteRecord();
		record.get('store').commit();
		
		this.transitionToRoute('contacts')
	},

	save: function(){
		var current = this.get('clone');
		var record = App.Contact.find(current.id);

		record.set('name', current.name);
		record.set('phone', current.phone);
		record.set('email', current.email);

		this.transitionToRoute('contacts')
	}
});

App.ContactlistController = Ember.ArrayController.extend({
	itemController: 'contactss'
});

App.ContactssController = Ember.ObjectController.extend({
	contacts: function() {
		var contactListItem  = this;
		
		return App.Contact.filter(
			function(item, index, self) {
				if (item.get('name').toUpperCase().charAt(0) == contactListItem.get('name'))
					return true;
			}
		);
	}.property('name')
});


// Validators
App.validateName = function(name){
	return name.trim().length > 0;
};

App.validatePhone = function(phone){
	if(!phone)
		return true;

	return /^\-?\d*$/.test(phone);
};

App.validateEmail = function(email){
	if(!email)
		return true;

	//some simple email regex
	return /^\w+@[a-zA-Z_]+?\.[a-zA-Z]{2,3}$/.test(email);
};

App.validateContact = function(contact){
	return App.validateName(contact.name) &&
		App.validatePhone(contact.phone) &&
		App.validateEmail(contact.email)
};


// Data
App.Contact.FIXTURES = [
	{id:1, name:'Ann', phone:'1234567890', email:'Ann@mail.com'},
	{id:2, name:'Andy', phone:'1234567890', email:'Andy@mail.com'},
	{id:3, name:'Brian', phone:'1234567890', email:'Brian@mail.com'},
	{id:4, name:'Beaver', phone:'1234567890', email:'Beaver@mail.com'}
];

App.Category.FIXTURES = [
	{id:1, name:'A'},
	{id:2, name:'B'},
	{id:3, name:'C'},
	{id:4, name:'D'},
	{id:5, name:'E'},
	{id:6, name:'F'},
	{id:7, name:'G'},
	{id:7, name:'H'},
	{id:9, name:'I'},
	{id:10, name:'J'},
	{id:11, name:'K'},
	{id:12, name:'L'},
	{id:13, name:'M'},
	{id:14, name:'N'},
	{id:15, name:'O'},
	{id:16, name:'P'},
	{id:17, name:'Q'},
	{id:18, name:'R'},
	{id:19, name:'S'},
	{id:20, name:'T'},
	{id:21, name:'U'},
	{id:22, name:'V'},
	{id:23, name:'W'},
	{id:24, name:'X'},
	{id:25, name:'Y'},
	{id:26, name:'Z'}
];
