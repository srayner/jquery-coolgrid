/*
 * coolgrid - Grid plugin for jQuery.
 * 
 * Author:  S Rayner
 * Date:    17/10/2011
 * Version: 0.2 (31/12/2011)
 * 
 */
(function($){
	
	var dataUrl;
	var sortField;
	var sortDir;
	var page;
	var limit;
	var table;
	var totalPages;
	var totalRecords;
	var cols;
	var filters;
	var operators = ['eq','ne','bw','bn','ew','en','cn','nc'];
	var search;
	
	// build filter object
	function buildFilterObject(){
		
		var s = '{"groupOp":"AND","rules":[';
		$('.srGrid-searchCriteria tr').each(function(index,element){
			s = s + '{';
			i = $('.sr-field-selection select', this).prop('selectedIndex');
			s = s + '"field":"' + cols[i].field + '",';
			i = $('.sr-criteria-selection select', this).prop('selectedIndex');
			s = s + '"op":"' + operators[i] + '",';
			t = $('.sr-text-value input', this).prop('value');
			s = s + '"data":"' + t + '"';
			s = s + '}';
		});
		s = s + ']}';
		
		return s;
	}
	
	// modal close
	function modalClose(){
		$('.sr-overlay').remove();
		$('.sr-modal').remove();
	}
	
	// modal popup
	function modalPopup(){
	
		var overlay;
		overlay = '<div class="sr-overlay" style="height: 100%; width: 100%; position: fixed; ' +
		            'left: 0px; top: 0px; z-index: 949; background-color: #000000; opacity: 0.3;"></div>';
		var popup;
		popup = '<div class="sr-modal" style="z-index: 950;">' +
		          '<div class="sr-modal-title"></div>' +
		          '<div class="sr-modal-content"></div>' +
		        '</div>';
		
		var table;
		table = '<table class="srGrid-searchCriteria"><tr>' +
		        '<td class="sr-field-selection"></td>' +
		        '<td class="sr-criteria-selection"></td>' +
		        '<td class="sr-text-value"><input type="text"></input></td>'+
		        '</tr></table>';
		
		var fieldSelect;
		fieldSelect = '<select>';
		for(i=0; i<cols.length; i++){
			fieldSelect = fieldSelect + '<option>' + cols[i].label + '</option>';
		}
		fieldSelect = fieldSelect + '</option>';
		
		var criteriaSelect;
		criteriaSelect = '<select>' +
		                 '<option>equals</option>' +
		                 '<option>not equals</option>' +
		                 '<option>begins with</option>' +
		                 '<option>does not begin with</option>' +
		                 '<option>ends with</option>' +
		                 '<option>does not end with</option>' +
		                 '<option>contains</option>' +
		                 '<option>does not contain</option>' +
		                 '</select>';
		var okButton;
		okButton = '<button class="posh blue button sr-button-search sr-right" type="button">' +
                     '<span class="icon search"></span>' +
                     '<span>Search</span>' +
                   '</button>';
		var clearFix;
		clearFix = '<div class="clearfix"></div>';
		$('body').append(overlay);
		$('body').append(popup);
		$('.sr-modal-title').append('<h2>Search Criteria</h2>')
		                    .append('<span class="sr-modal-close">x</span>');
		$('.sr-modal-content').append(table);
		$('.sr-modal-content').append(okButton);
		$('.sr-modal-content').append(clearFix);
		$('.sr-field-selection').append(fieldSelect);
		$('.sr-criteria-selection').append(criteriaSelect);
		$('.sr-modal-close').click(modalClose);
		$('.sr-modal').draggable();
		$('.sr-button-search').click(function(){
			filters = buildFilterObject();
			search = true;
			ajaxRequest();
			modalClose();
		});
	}
	
	// ajax success callback
	function ajaxSuccess(data, textStatus, jqXHR){
		$('.sr-data-row').remove();
		
		// Wait icon
		$('.sr-waiting-overlay').remove();
		
		for (var i=0; i<data.rows.length; i++) {
			
			// Rows
			var row;
			if (i % 2 == 0){
				row = '<tr class="sr-data-row">';
			} else {
				row = '<tr class="sr-data-row alt">';
			}
			for (var j=0; j<data.rows[i].length; j++){
				row = row + '<td>' + data.rows[i][j] + '</td>';
			}
			row = row + '</tr>';
			$('.sr-grid-body').append(row);
			
			// Footer Info
			totalPages = data.total;
			totalRecords = data.records;
			var firstRec = ((page - 1) * limit) + 1;
			var lastRec = firstRec + limit - 1;
			if (lastRec > totalRecords){
				lastRec = totalRecords;
			}
			var caption = 'Showing ' + firstRec + '-' + lastRec + ' of ' + totalRecords;
			$('.sr-grid-info').html(caption);
			$('.sr-grid-nav').html('Page ' + page + ' of ' + totalPages);
			
		}
	}
	
	// sends ajax request to server
	function ajaxRequest(){
		var obj = {
			'filters' : filters,
			'sortField' : sortField,
			'sortDir' : sortDir,
			'page' : page,
			'limit' : limit,
			'_search' : search
		}; 
		
		// Wait icon
		$('.sr-grid').prepend('<div class="sr-waiting-overlay">Please wait. Loading data...</div>');
		
		$.ajax({
			url: dataUrl,
			data: obj,
			dataType: 'json',
			success: ajaxSuccess,
			error: function (xhr, error, thrown) {
				if ( error == "parsererror" ) {
					alert("Error: Data from server could not be parsed. ");
				}
			}
		});
		
	}
	
	// Applies correct classes to none and
	// child span.
	function sort(node){
		$('span', node).removeClass('sr-icon-asc sr-icon-desc')
		               .addClass('hidden');
		if($(node).hasClass('sorted-asc')){
			$('span', node).addClass('sr-icon-asc')
			               .removeClass('hidden');
		}
		if($(node).hasClass('sorted-desc')){
			$('span', node).addClass('sr-icon-desc')
			               .removeClass('hidden');
		}
	}
	
	$.fn.srgrid = function(options){

		// Default options
		var defaults = {
			title: 'Data Grid',
			dataUrl: '',
			page: 1,
			limit: 10
		};
		var options = $.extend(defaults, options);
		cols = options.cols;
		dataUrl = options.dataUrl;
		page = options.page;
		limit = options.limit;
		sortField = options.cols[0].field;
		sortDir = 'asc';
		
		var sButtonFirst   = '<button class="sr-button-light sr-button-first" type="button">' +
		                     '<span class="sr-icon sr-icon-first"></span>' +
	                         '</button>';
		
		var sButtonPrior   = '<button class="sr-button-light sr-button-prior" type="button">' +
                             '<span class="sr-icon sr-icon-prior"></span>' +
                             '</button>';
		
		var sButtonNext    = '<button class="sr-button-light sr-button-next" type="button">' +
                             '<span class="sr-icon sr-icon-next"></span>' +
                             '</button>';
		
		var sButtonLast    = '<button class="sr-button-light sr-button-last" type="button">' +
                             '<span class="sr-icon sr-icon-last"></span>' +
                             '</button>';
		
		var sButtonRefresh = '<button class="sr-button-light sr-button-refresh" type="button">' +
		                     '<span class="sr-icon sr-icon-refresh"</span>' +
		                     '</button>';
		
		var sNav = sButtonFirst + sButtonPrior + '<span class="sr-grid-nav"></span>' + sButtonNext + sButtonLast;
		var sInfo = sButtonRefresh + '<span class="sr-grid-info"></span>';
		var sNavContainer = '<div class="sr-grid-nav-container">' + sNav + '</div>';
		var sInfoContainer = '<div class="sr-grid-info-container">' + sInfo + '</div>';
		
		return this.each(function() {  
			var $this = $(this);
			
			// Add the title bar, and wrap with containing div.
			var sTitleBar = '<div class="sr-blue-mirror">' +
                              '<div class="title-container">' +
                                '<div class="sr-icon sr-icon-grid left"></div>' +
                                '<span>' + options.title + '</span>' +
                              '</div>' +
                            '</div>';
			$this.addClass('sr-coolgrid').prepend(sTitleBar);
			$('table', this).wrap('<div class="sr-grid" />');
			
			
			table = this;
			
			// create the table head and body tag.
			$('table', this).append('<thead class="sr-grid-head"></thead>' +
					                '<tbody class="sr-grid-body"></tbody>');
			
			// Create header row and prepend to table head.
			var row = '<tr class="sr-row-header">';
			for (var i=0; i<options.cols.length; i++){
				if(options.cols[i].width != null){
					sStyle = 'style="width:' + options.cols[i].width + ';" ';
				} else {
					sStyle = '';
				}
				row = row + '<th ' + sStyle + '>' + options.cols[i].label + '</th>';
			}
			row = row + '</tr>';
			$('.sr-grid-head').prepend(row);
			
			// Fix up the last column header.
			$('th:last', this).addClass('last');
			
			// Add functionality to headers
			$('th', this).each(function(index){
				if(options.cols[index].sortable){
					
					var node = this;
					var label = $(this).html();
					$(this).addClass('srgrid-sortable')
						   .html(label + '<span class="sr-icon hidden"></span>')
					       .click(function(){
					    	   if($(node).hasClass('sorted-asc')){
					    		   $(node).addClass('sorted-desc')
					    		          .removeClass('sorted-asc');
					    		   sortDir = 'desc';
					    	   }
					    	   else if($(node).hasClass('sorted-desc')){
					               $(node).addClass('sorted-asc')
					    		          .removeClass('sorted-desc');
					    		   sortDir = 'asc';
					    	   }
					    	   else {
					    		   $(node).addClass('sorted-asc');
					    		   sortDir = 'asc';
					    	   }
					    	   sortField = options.cols[index].field;
					    	   ajaxRequest();
					    	   $('th', table).each(function(i){
					    		   if(i!=index){
					    			   $(this).removeClass('sorted-asc sorted-desc');
					    		   }
					    		   sort(this);
					    	   });
					       });
				}
				if(options.cols[index].searchable){
					$(this).addClass('srgrid-searchable');
				}
				
			});
			
			// Add the footer div.
			$this.append('<div class="sr-grid-footer">' + sNavContainer + sInfoContainer + '</div>');
			
			// Search button
			if(options.searchButton != null){
				$(options.searchButton).click(modalPopup);
			}
			
			// First button onClick handler.
			$('.sr-button-first').click(function(){
				page = 1;
				ajaxRequest();
			});
			
			// Prior button onClick handler.
			$('.sr-button-prior').click(function(){
				page--;
				if (page<1){
					page = 1;
				}
				ajaxRequest();
			});
			
			// Next button onClick handler.
			$('.sr-button-next').click(function(){
				page++;
				if (page>totalPages){
					page = totalPages;
				}
				ajaxRequest();
			});
			
			// Last button onClick handler.
			$('.sr-button-last').click(function(){
				page = totalPages;
				ajaxRequest();
			});
			
			// Refresh button
			$('.sr-button-refresh').click(function(){
				ajaxRequest();
			});
			
			ajaxRequest();
			
		});
		
	};
	
})(jQuery);