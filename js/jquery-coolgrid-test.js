/**
 * 
 */
$(function(){
	
	// transform my grid.
	var options = {
		atitle: 'Users',
		dataUrl: 'server.php',
		rowNum:10,
	   	rowList:[10,20,30],
	   	searchButton: '.searchButton',
		cols: [
			{label: 'Id', field: 'u.user_id', sortable: true, searchable: true},
			{label: 'Username', field: 'u.username', sortable: true},
			{label: 'Role', field: 'u.role_descr', sortable: true},
			{label: 'First Name', field: 'u.firstname', sortable: true},
			{label: 'Last Name', field: 'u.lastname', sortable: true},
			{label: 'Email Address', field: 'u.email', sortable: true},
			{label: 'Phone No', field: 'u.phone', sortable: true},
			{label: 'Actions', sortable: false, searchable: false, width: '120px'}
		]
	};
	
	$('.mygrid').srgrid(options);
	
});