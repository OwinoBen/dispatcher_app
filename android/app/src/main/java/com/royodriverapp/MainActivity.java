package com.royodriverapp;
import android.os.Bundle;
import com.facebook.react.ReactActivity;
import org.devio.rn.splashscreen.SplashScreen; // here
import com.brentvatne.react.ReactVideoPackage;
import com.facebook.react.shell.MainReactPackage;

public class MainActivity extends ReactActivity {

  /**
   * Returns the name of the main component registered from JavaScript. This is used to schedule
   * rendering of the component.
   */
  @Override
protected void onCreate(Bundle savedInstanceState) {
  SplashScreen.show(this);  // here
  super.onCreate(null);
  
}
  @Override
  protected String getMainComponentName() {
    return "RoyoDriverApp";
  }
}
