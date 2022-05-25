import { Component, Input, Output, EventEmitter, OnChanges, SimpleChanges, Renderer2, ElementRef, ViewChild, Inject, Directive, TemplateRef, ContentChild, OnDestroy, HostListener } from '@angular/core';
import { DOCUMENT } from '@angular/common';

@Directive( {
    selector: '[select-dropdown-option]'
} )
export class SelectDropdownOptionDirective
{
    constructor( public templateRef: TemplateRef<any> ) { }
}

@Directive( {
    selector: '[selected-dropdown-option]'
} )

export class SelectedDropdownOptionDirective
{
    constructor( public selectedTemplateRef: TemplateRef<any> ) { }
}

@Directive( {
    selector: '[dropdown-option-not-found]'
} )

export class DropdownOptionNotFoundDirective
{
    constructor( public optionNotFoundTemplateRef: TemplateRef<any> ) { }
}
@Component({
  selector: 'yselect',
  templateUrl: './select.component.html',
  styleUrls: ['./select.component.css']
})
export class SelectComponent implements OnChanges  {

  @ViewChild( 'searchInput' ) searchInput!: ElementRef ;
    @ViewChild('dropdownPopup')  dropdownPopup!: ElementRef;

    @ContentChild( SelectDropdownOptionDirective ) optionTemplate!: SelectDropdownOptionDirective;
    @ContentChild( SelectedDropdownOptionDirective ) selectedOptionTemplate!: SelectedDropdownOptionDirective;
    @ContentChild( DropdownOptionNotFoundDirective ) optionNotFoundTemplate!: DropdownOptionNotFoundDirective;

    @Input( "textField" ) public textField: string = "Name";
    @Input( "valueField" ) public valueField: string = "ID";
    @Input( "allowClear" ) public allowClear: boolean = true;
    @Input( "multiple" ) public multiple: boolean = false;
    @Input( "placeholder" ) public placeholder: string = "";
    @Input( "width" ) public cssWidth: string = "100%";
    @Input( "lazy" ) public lazy: boolean = false;
    @Input( "sort" ) public sort: boolean = true;
    @Input( "addMissingItem" ) public addMissingItem: boolean = true;

    @Input( "items" ) public items!: any[];
    @Input( "ngValue" ) public ngValue: any | any[];
    @Input( "ngObject" ) public ngObject: any | any[];
    @Input( "noResultsFound" ) public noResultsFound: string = "Start typing to search...";
    @Input( "hidden" ) public hidden: boolean = false;

    @Output( "ngValueChange" ) public ngValueChange: EventEmitter<number | number[]> = new EventEmitter();
    @Output( "ngObjectChange" ) public ngObjectChange: EventEmitter<any | any[]> = new EventEmitter();
    @Output( "change" ) public change: EventEmitter<void> = new EventEmitter();
    @Output( "select" ) public select: EventEmitter<any> = new EventEmitter();
    @Output( "remove" ) public remove: EventEmitter<any> = new EventEmitter();
    @Output( "returnRemovedValue" ) public returnRemovedValue: EventEmitter<any> = new EventEmitter();
    @Output( "search" ) public search: EventEmitter<string> = new EventEmitter();
    @Output( "typed" ) public typed: EventEmitter<string> = new EventEmitter();
    @Output( "onShow" ) public onShow: EventEmitter<void> = new EventEmitter();

    /**
     * variable to track if clicked inside or outside of component
     */
    public clickedInside: boolean = false;

    public query!: string ;
    public dropDownOpen: boolean = false;
    public options!: SelectGroup[];
    public hasVisibleOptions: boolean = true;

    public toggleDropdown = false;
    public multipleOptionCleared = false;

    private listeners = [];
    private searchTimer!:any;
    private timeoutIDs: number[] = [];
    constructor( @Inject( DOCUMENT ) private document: Document,
        private renderer: Renderer2, private elementRef: ElementRef )
    {
    }

    /**
    * click listener for host inside this component i.e
    * if many instances are there, this detects if clicked inside
    * this instance
    */
    @HostListener( 'click', ['$event'] )
    clickInsideComponent( e:any )
    {
        this.multipleOptionCleared = false;
        this.clickedInside = true;

        // clear selected options
        if (this.multiple) {
            if (this.ngObject == null || this.ngObject == "") {
                for (let g of this.options) {
                    let selected = g.Options.filter(x => x.Selected == true);
                    if (!!selected) {
                        for (let m of selected) {
                            m.Selected = false;
                        }
                    }
                }
            }
        }
    }

    /**
     * click handler on documnent to hide the open dropdown if clicked outside
     */
    @HostListener( 'document:click', ['$event'] )
    clickOutsideComponent( event:any )
    {
        if ( !this.clickedInside && this.toggleDropdown && this.isClickOutside( event ) )
        {
            this.toggleDropdown = false;
        }
        this.clickedInside = false;
    }

    private isClickOutside( event: MouseEvent ): boolean
    {
        return !this.elementRef.nativeElement.contains( event.target );
    }


    ngOnChanges( changes: SimpleChanges ): void
    {
        if ( changes["items"] )
        {
            if ( this.items && this.items.length && this.items[0].hasOwnProperty( "label" ) && this.items[0].hasOwnProperty( "options" ) )
            {
                this.options = this.items.map( m =>
                {
                    // It's possible that not all groups have data loaded yet
                    let tempOptions = m.options || [];

                    return {
                        Label: m.label,
                        Options: tempOptions
                            .map( (n: any) => this.anyToItem( n ) )
                            .sort( ( a: SelectItem, b: SelectItem ) => this.sortItems( a, b ) ),
                        Visible: tempOptions.length,
                    };
                } );
            }
            else
            {
                this.options = [{
                    Label: '',
                    Options: !this.items ? [] : this.items
                        .map( n => this.anyToItem( n ) )
                        .sort( ( a, b ) => this.sortItems( a, b ) ),
                    Visible: !this.items ? 0 : this.items.length,
                }];
            }

            if ( this.addMissingItem ) this.ensureObjectPresent();
            this.setSelectedItems();
            this.hasVisibleOptions = this.options.filter( m => m.Visible > 0 ).length > 0;
        }

        if ( changes["ngValue"] )
        {
            this.setSelectedItems();
        }
    }

    private ensureObjectPresent(): void
    {
        if ( !this.ngObject ) return;

        let missing: SelectItem[] = [];
        let selected = Array.isArray( this.ngObject ) ? this.ngObject : [this.ngObject];

        for ( let s of selected )
        {
            let found = false;

            for ( let g of this.options )
            {
                for ( let m of g.Options )
                {
                    if ( m.Value == s[this.valueField] && !found )
                    {
                        m.Selected = found = true;
                    }
                }
            }

            if ( !found )
            {
                missing.push( this.anyToItem( s ) );
            }
        }

        if ( missing.length > 0 )
        {
            this.options.unshift( {
                Label: '', Options: missing.sort( ( a, b ) => this.sortItems( a, b ) ), Visible: missing.length
            } );
        }
    }

    private setSelectedItems(): void
    {
        if ( Array.isArray( this.ngValue ) )
        {
            this.ngObject = [];
        }
        else
        {
            this.ngObject = null;
        }

        if ( this.ngValue || this.ngValue === false || this.ngValue === 0 || this.ngValue === "" )
        {
            let list = Array.isArray( this.ngValue ) ? this.ngValue : [this.ngValue];

            for ( let g of this.options )
            {
                for ( let m of g.Options )
                {
                    let item = list.find( n => n === m.Value );

                    if ( item || item === false || item === 0 || item === "" )
                    {
                        m.Selected = true;

                        if ( Array.isArray( this.ngValue ) )
                        {
                            this.ngObject.push( m.Original );
                        }
                        else
                        {
                            this.ngObject = m.Original;
                        }
                    }
                }
            }
        }

        if ( !!this.ngObject )
        {
            this.ngObjectChange.emit( this.ngObject );
        }
    }

    private anyToItem( m: any ): SelectItem
    {
        if ( typeof m === 'object' )
        {
            return {
                Original: m,
                Hidden: false,
                Selected: false,
                Text: m[this.textField],
                Value: m[this.valueField],
            };
        } else
        {
            return {
                Original: { ID: m, Name: m },
                Hidden: false,
                Selected: false,
                Text: m,
                Value: m,
            };
        }
    }

    private sortItems( a: SelectItem, b: SelectItem ): number
    {
        if ( this.sort )
        {
            return a.Text > b.Text ? 1 : -1;
        }
        else
        {
            return 0;
        }
    }

    public toggleSelectDropdown()
    {
        if ( this.multipleOptionCleared )
        {
            this.toggleDropdown = false;
        } else
        {
            this.toggleDropdown = !this.toggleDropdown;
        }
    }

    public focus(): void
    {
        this.timeoutIDs.push( window.setTimeout( () =>
        {
            if ( !!this.searchInput )
            {
                ( this.searchInput.nativeElement as HTMLInputElement ).focus();
                this.document.body.appendChild( this.dropdownPopup.nativeElement );
            }
        }, 0 ) );
        this.onShow.emit();
    }

    public onSearchInputKeyUp(): void
    {
        if ( this.searchTimer ) clearTimeout( this.searchTimer );
        this.searchTimer = window.setTimeout( () => this.filterList(), 200 );
        this.timeoutIDs.push( this.searchTimer );
    }

    public filterList(): void
    {
        this.typed.emit( this.query )
        if ( this.lazy )
        {
            this.search.emit( this.query );
        }
        else
        {
            if ( !this.query || this.query.length == 0 )
            {
                for ( let g of this.options ) for ( let m of g.Options ) m.Hidden = false;
            }
            else
            {
                for ( let g of this.options )
                    for ( let m of g.Options )
                        m.Hidden = m.Text.toLocaleLowerCase().indexOf( this.query.toLocaleLowerCase() ) < 0;
            }

            for ( let g of this.options )
            {
                g.Visible = g.Options.filter( m => !m.Hidden ).length;
            }

            this.hasVisibleOptions = this.options.filter( m => m.Visible > 0 ).length > 0;
        }
    }

    public searchCallback(search: string, options: any, searchCriteria: string): any {
        let filteredList = [];
        for (let i = 0; i < options.length; i++) {
            for (var key in options[i]) {
                if (options[i].hasOwnProperty(key)) {
                    if (searchCriteria == 'arrayObject' && typeof options[i][key] === 'object') {
                        let option = options[i][key];
                        if (!!option) {
                            for (let key in option) {
                                if (option[key].toString().toLowerCase().indexOf(search) >= 0) {
                                    filteredList.push(options[i]);
                                    break;
                                }
                            }
                        }
                    } else if (searchCriteria == 'array') {
                        // single value to search
                        let option: string = options[i][key];
                        if (!!option) {
                            if (option.toString().toLowerCase().indexOf(search) >= 0) {
                                filteredList.push(options[i]);
                                break;
                            }
                        }
                    }
                }
            }
        }
        return filteredList;
    }

    public clear(): void
    {
        this.multipleOptionCleared = true;
        setTimeout( () =>
        {
            this.returnRemovedValue.emit( this.ngValue );
            this.query = '';

            this.ngValue = null;
            this.ngObject = null;

            for ( let g of this.options ) for ( let m of g.Options ) m.Hidden = false, m.Selected = false;

            this.ngValueChange.emit( this.ngValue );
            this.ngObjectChange.emit( this.ngObject );
            this.remove.emit( this.ngValue );
            this.change.emit();
        }, 100 );
    }

    public clearAllSelectedItems(): void
    {
        this.ngValue = null;
        this.ngObject = null;

        for ( let g of this.options ) for ( let m of g.Options ) m.Hidden = false, m.Selected = false;

        this.ngValueChange.emit( this.ngValue );
        this.ngObjectChange.emit( this.ngObject );
        this.remove.emit( this.ngValue );
        this.change.emit();
    }

    public clearObj( obj:any ): void
    {
        this.multipleOptionCleared = true;
        this.query ='';

        this.ngValue = this.ngValue.filter( (m: any) => m != obj[this.valueField] );
        this.ngObject = this.ngValue.filter( (m: any) => m != obj );

        for ( let g of this.options )
        {
            for ( let m of g.Options )
            {
                m.Hidden = false;

                if ( m.Value == obj[this.valueField] )
                {
                    m.Selected = false;
                }
            }
        }

        this.returnRemovedValue.emit( obj );
        this.ngValueChange.emit( this.ngValue );
        this.ngObjectChange.emit( this.ngObject );
        this.remove.emit( this.ngValue );
        this.change.emit();
    }

    public itemClicked( item: SelectItem ): void
    {
        this.query = '';
        for ( let g of this.options ) for ( let m of g.Options ) m.Hidden = false;

        let allItems = [].concat.apply( [], this.options.map( (m:any) => m.Options ) );

        if ( this.multiple )
        {
            item.Selected = !item.Selected;

            this.ngValue = allItems.filter( (m: any) => m.Selected ).map( (m: any) => m.Value );

            this.ngObject = allItems.filter( (m: any) => m.Selected) .map( (m: any) => m.Original );
        }
        else
        {
            for ( let m of allItems ) {
              // m.Selected = false;
              (m: any) => m!.Selected = false;
            }

            item.Selected = true;
            this.ngValue = item.Value;
            this.ngObject = item.Original;
        }

        this.ngValueChange.emit( this.ngValue );
        this.ngObjectChange.emit( this.ngObject );

        if ( item.Selected )
        {
            this.select.emit( item );
        }
        else
        {
            this.remove.emit( item.Value );
        }

        this.change.emit();
    }

    private getPosition( el: any ): { top: number, left: number }
    {
        let offsetLeft = 0;
        let offsetTop = 0;
        try
        {
            while ( el )
            {
                offsetLeft += el.offsetLeft - el.scrollLeft;
                offsetTop += el.offsetTop - el.scrollTop;
                el = el.offsetParent;
            }
            return { top: offsetTop, left: offsetLeft }
        }
        finally
        {
            offsetLeft = 0;
            offsetTop = 0;
        }
    }
}

class SelectItem
{
    public Value: any;
    public Text!: string;
    public Hidden!: boolean;
    public Selected!: boolean;
    public Original: any;
}

class SelectGroup
{
    public Label!: string;
    public Visible!: number;
    public Options!: SelectItem[];
}
