import cv2 as cv
import numpy as np


def detect_object(img_target, img_template, threshold=0.7):
  img_gray = cv.cvtColor(img_target, cv.COLOR_BGR2GRAY)
  res = cv.matchTemplate(img_gray, img_template, cv.TM_CCOEFF_NORMED)
  loc = np.where(res >= threshold)
  return loc


img_rgb = cv.imread('./666.PNG')
template = cv.imread('./images/16.PNG', 0)
print(detect_object(img_rgb, template))
