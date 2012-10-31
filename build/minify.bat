java -jar compiler.jar --js=../js/mobiscroll.core.js --js=../js/mobiscroll.datetime.js --js=../js/mobiscroll.select.js --js=../js/mobiscroll.android.js --js=../js/mobiscroll.android-ics.js --js=../js/mobiscroll.ios.js --js=../js/mobiscroll.jqm.js --js_output_file=mobiscroll.full.min.js
copy /b ..\css\mobiscroll.core.css+..\css\mobiscroll.android.css+..\css\mobiscroll.android-ics.css+..\css\mobiscroll.ios.css+..\css\mobiscroll.jqm.css+..\css\mobiscroll.sense-ui.css+..\css\mobiscroll.animation.css mobiscroll.full.css
java -jar yuicompressor.jar mobiscroll.full.css -o mobiscroll.full.min.css
