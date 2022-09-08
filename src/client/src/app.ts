// import required elements
import { Application, VLayout, Label, installHMR, Icon, HLayout } from 'x4js'

// create the application
let app = new Application( {
	app_name: "Demo",
	app_version: "1.0.0"
} );


/**
 * 
 */

class HeaderBar extends HLayout {
	constructor( props ) {
		super( props );

		this.setContent( [
			new Icon( { icon: "var(--app-icon)"}),
			new Label( { flex: 1, text: "X4JS Node Demo Template" } )
		]);
	}
}

/**
 * 
 */

class MainFrame extends VLayout {
	constructor( props ) {
		super( props );

		this.addClass( "@fit" );
		this.setContent( [
			new HeaderBar( { } )
		]);
	}
}

// create the main frame
let frame = new MainFrame( { });

// define it as the app main frame.
app.mainView = frame;

declare const DEBUG;

if( DEBUG ) {
	installHMR( );
}
