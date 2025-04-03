
// Custom dropdown - select option 


  jQuery('[js-custom-option-select]').each(function(){
    var $this = jQuery(this), numberOfOptions = jQuery(this).children('option').length;
    
    $this.addClass('select-hidden'); 
    $this.wrap('<div class="select"></div>');
    $this.after('<div class="select-styled"></div>');


    var $styledSelect = $this.next('div.select-styled');
    
    $styledSelect.text($this.children('option').eq(0).text());
  
    var $list = jQuery('<ul />', {
        'class': 'select-options'
    }).insertAfter($styledSelect);
  
    for (var i = 0; i < numberOfOptions; i++) {
        jQuery('<li />', {
            text: $this.children('option').eq(i).text(),
            rel: $this.children('option').eq(i).val()
        }).appendTo($list);
        if ($this.children('option').eq(i).is(':selected')){
          jQuery('li[rel="' + $this.children('option').eq(i).val() + '"]').addClass('is-selected')
        }
    }
  
    var $listItems = $list.children('li');
  
    $styledSelect.click(function(e) {
        e.stopPropagation();
        jQuery('div.select-styled.active').not(this).each(function(){
            jQuery(this).removeClass('active').next('ul.select-options').hide();
        });
        jQuery(this).toggleClass('active').next('ul.select-options').toggle();
    });
    $styledSelect.append(`<div class="select-styled-icon"><svg xmlns="http://www.w3.org/2000/svg" width="6" height="10" viewBox="0 0 6 10" fill="none"><path d="M1 9L5 5L1 1" stroke="#172926" stroke-width="1.2" stroke-linecap="round"/></svg></div>`);
  
    $listItems.click(function(e) {
        e.stopPropagation();
        $styledSelect.text(jQuery(this).text()).removeClass('active');
        $this.val(jQuery(this).attr('rel'));
        $list.find('li.is-selected').removeClass('is-selected');
        $list.find('li[rel="' + jQuery(this).attr('rel') + '"]').addClass('is-selected');
        $list.hide();
        document.dispatchEvent(new CustomEvent('selectPDPOptions:change', { detail: $this }))

        $styledSelect.append(`<div class="select-styled-icon"><svg xmlns="http://www.w3.org/2000/svg" width="6" height="10" viewBox="0 0 6 10" fill="none"><path d="M1 9L5 5L1 1" stroke="#172926" stroke-width="1.2" stroke-linecap="round"/></svg></div>`);
        //console.log($this.val());
    });
  
    jQuery(document).click(function() {
        $styledSelect.removeClass('active');
        $list.hide();
    });

});
