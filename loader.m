function [rgb, gray] = loader(url)
   rgb = imread(char(url));
   gray = rgb2gray(rgb);
end