function [nascentness] = processor(tileUrl)
    %% Plot Settings
    figure;
    plotRows = 2;
    plotCols = 3;
    firstSub = 1;
    [rgb,gray]= loader(tileUrl);
    subplot(plotRows, plotCols, firstSub);
    firstSub = firstSub + 1;
    imshow(rgb);
    title('Original  Image');
    
    %% Set structring element size, open close
    se = strel('disk', 7);
    erodedDilatedOpen = imopen(gray, se);
    dilatedErodedClose = imclose(erodedDilatedOpen, se);
   
    subplot(plotRows, plotCols, firstSub);
    firstSub = firstSub + 1;
    imshow(dilatedErodedClose);
    title('Opening & Closing');
    
    %% Opening and closing by reconstruction
    eroded = imerode(gray, se); 
    erodedReconstructed = imreconstruct(eroded, gray);
    
    reconstructedDilated = imdilate(erodedReconstructed,se);
    reDilateReconstruct = imreconstruct(imcomplement(reconstructedDilated), imcomplement(reconstructedDilated));
    
    subplot(plotRows, plotCols, firstSub);
    firstSub = firstSub + 1;
    imshow(reDilateReconstruct);
    title('Opening & Closing by Reconstruction');
    
    %% Thresholding
    bw = im2bw(reDilateReconstruct, graythresh(reDilateReconstruct));%seperating the light and dark region

    subplot(plotRows, plotCols, firstSub);
    firstSub = firstSub + 1;
    imshow(bw);
    title('Thresholding');
    
    %% Watershed segmentation
    
    %%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
    %cleanerImage = ~bwareaopen(~bw, 10);
    complement= -bwdist(~bw);
    
    Ld = watershed(complement);
    cleanerImage = bw;
    cleanerImage(Ld == 0) = 0;
    
    subplot(plotRows, plotCols, firstSub);
    firstSub = firstSub + 1;
    imshow(cleanerImage);
    title('Raw Watershed Transform');
    
    %numBlackPixels= sum(sum(cleanerImage == 0));
    numWhitePixels= sum(sum(cleanerImage));
    
    totalNumberOfPixels = size(cleanerImage,1)*size(cleanerImage,2);
    nascentness = 100.0 * numWhitePixels/totalNumberOfPixels;
    
    mask = imextendedmin(complement,2);
    imposeMinimum = imimposemin(complement,mask);
    Ld2 = watershed(imposeMinimum);
    watershedSegment = bw;
    watershedSegment(Ld2 == 0) = 0;

    T = rgb;
    T(watershedSegment) = 255;
    
    subplot(plotRows, plotCols, firstSub);
    %firstSub = firstSub + 1;
    imshow(T);
    title(sprintf('Nascentness : %f', nascentness)); 
   %%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
end
