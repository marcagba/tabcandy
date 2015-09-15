# Dev Setup #

_these instructions are for Mac only so far_

You might want to do you development with a separate Firefox profile. You can do this on the command line:

```
/Applications/Firefox.app/Contents/MacOS/firefox-bin -no-remote -P dev &
```

This will launch a new Firefox instance with the profile named "dev".

This new profile won't have any extensions, and the preferences will be default. It's recommended you install Firebug, even though code debugging doesn't work in chrome mode (at least the console and inspectors still work). Actually, you can't use console.log() directly, but you can use our Utils.log() with Firebug.

Once you have a copy of the depot on your harddrive, point Firefox to it by creating a file with the full path to the folder (e.g. c:\dev\tabcandy on Windows, /home/user/dev/tabcandy on Linux) in a file named tabcandy@aza.raskin and copy that file to [profile folder](your.md)\extensions\ then restart Firefox.