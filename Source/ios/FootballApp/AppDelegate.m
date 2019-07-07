/**
 * Copyright (c) 2015-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

#import "AppDelegate.h"

#import <React/RCTLinkingManager.h>
#import <React/RCTBundleURLProvider.h>
#import <React/RCTRootView.h>
#import <FBSDKCoreKit/FBSDKCoreKit.h>
#import <RNGoogleSignin/RNGoogleSignin.h>

@implementation AppDelegate

- (BOOL)application:(UIApplication *)app openURL:(NSURL *)url options:(NSDictionary<UIApplicationOpenURLOptionsKey, id> *)options
{
  BOOL handledFB = [[FBSDKApplicationDelegate sharedInstance] application:app
                                                                  openURL:url options:options];
  BOOL handledGM = [RNGoogleSignin application:app
                                        openURL:url
                              sourceApplication:options[UIApplicationOpenURLOptionsSourceApplicationKey]
                                     annotation:options[UIApplicationOpenURLOptionsAnnotationKey]];
  BOOL handledRCT = [RCTLinkingManager application:app openURL:url
                                           options:options];
  return handledFB || handledGM || handledRCT;
}

- (BOOL)application:(UIApplication *)application openURL:(NSURL *)url
  sourceApplication:(NSString *)sourceApplication annotation:(id)annotation {
  
  BOOL handledFB = [[FBSDKApplicationDelegate sharedInstance] application:application
                                                                  openURL:url
                                                        sourceApplication:sourceApplication
                                                               annotation:annotation
                    ];
  BOOL handledGM = [RNGoogleSignin application:application
                                       openURL:url
                             sourceApplication:sourceApplication
                                    annotation:annotation];
  BOOL handledRCT = [RCTLinkingManager application:application openURL:url sourceApplication:sourceApplication annotation:annotation];
  
  return handledFB || handledGM || handledRCT;
}

- (BOOL)application:(UIApplication *)application
continueUserActivity:(NSUserActivity *)userActivity
 restorationHandler:(void (^)(NSArray<id<UIUserActivityRestoring>> *restorableObjects))restorationHandler;
{
  return [RCTLinkingManager application:application
                   continueUserActivity:userActivity
                     restorationHandler:restorationHandler];
}

- (void)applicationDidBecomeActive:(UIApplication *)application {
  [FBSDKAppEvents activateApp];
}

- (BOOL)application:(UIApplication *)application didFinishLaunchingWithOptions:(NSDictionary *)launchOptions
{
  NSURL *jsCodeLocation;
  [[FBSDKApplicationDelegate sharedInstance] application:application
                           didFinishLaunchingWithOptions:launchOptions];
  jsCodeLocation = [[RCTBundleURLProvider sharedSettings] jsBundleURLForBundleRoot:@"index" fallbackResource:nil];

  RCTRootView *rootView = [[RCTRootView alloc] initWithBundleURL:jsCodeLocation
                                                      moduleName:@"FooodballApp"
                                               initialProperties:nil
                                                   launchOptions:launchOptions];
  rootView.backgroundColor = [[UIColor alloc] initWithRed:1.0f green:1.0f blue:1.0f alpha:1];

  self.window = [[UIWindow alloc] initWithFrame:[UIScreen mainScreen].bounds];
  UIViewController *rootViewController = [UIViewController new];
  rootViewController.view = rootView;
  self.window.rootViewController = rootViewController;
  [self.window makeKeyAndVisible];
  return YES;
}

@end
