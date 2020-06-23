import pyautogui
import sys

args = sys.argv[1]
filename = "H:\Programming\Web Design\Swing\screenshots\{}.png"
filename = filename.format(args)
pyautogui.screenshot(imageFilename=filename, region=(0, 0, 750, 765))
sys.stdout.flush()
