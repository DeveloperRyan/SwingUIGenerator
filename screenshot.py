import pyautogui
import sys

args = sys.argv[1]
filename = "./screenshots/{}.png"
filename = filename.format(args)
pyautogui.screenshot(imageFilename=filename, region=(0, 0, 1000, 1000))
sys.stdout.flush()
